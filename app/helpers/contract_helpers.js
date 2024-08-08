import date_helpers from './date_helpers.js';
import string_helpers from './string_helpers.js';
import drive from './drive_helpers.js';

import extenso from 'extenso';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import tmp from 'tmp';
import libre from 'libreoffice-convert';
import { promisify } from 'util';
const convertAsync = promisify(libre.convert);
const __dirname = import.meta.dirname;

const contract_helpers = {};

/**
* @typedef {import('pino').Logger} Logger
* @typedef {import('../models/aportes.model.js')} Aportes
* @typedef {import('../models/users_details.model.js')} UsersDetails
*/

/**
 * Generates a contract file, uploades it to google drive, and update aporte 
 * information with the id of the file on Google Drive
 * @param {Aportes} aporte Registro do aporte à ser gerado contrato.
 * @param {UsersDetails} users_details Registro dos detalhes do usuário.
 * @param {number} totalValue Valor total to aporte.
 * @param {string} template Template para geração do contrato.
 * @param {Logger?} logger Instancia do pino logger.
 */
contract_helpers.generateContractDocx = async (aporte, users_details, totalValue, template, logger) => {
    const tempDir = tmp.dirSync();

    // Load the docx file as binary content
    const content = fs.readFileSync(
        path.resolve(__dirname, `../templates/contracts/${template}.docx`),
        "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    let address = users_details.address + ', '
        + users_details.number + ', ';

    if (users_details.complement) {
        address += users_details.complement + ', ';
    }

    address += users_details.district + ', '
        + users_details.city + '/'
        + users_details.uf;

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render({
        name: users_details.firstName + ' ' + users_details.lastName,
        marital_status: users_details.maritalStatus !== null ? users_details.maritalStatus.toLowerCase() : "",
        document: users_details.document !== null ? string_helpers.formatCnpjCpf(users_details.document) : "",
        document_type: users_details.documentType,
        address: address,
        day: '01',
        month: date_helpers.getMonthName(new Date().getMonth()),
        year: new Date().getFullYear(),
        aporte: process.env.APORTE_PREFIX + aporte.id.padStart(5, "0"),
        value: new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL'
        }).format(totalValue),
        extenso: extenso(Math.round(totalValue),
            {
                mode: 'currency',
                locale: 'br',
                currency: {
                    type: 'BRL'
                }
            })
    });

    const buf = doc.getZip().generate({
        type: "nodebuffer",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
    });

    let contractPdfPath = path.resolve(tempDir.name, `Contrato_${(users_details.firstName + ' ' + users_details.lastName).replace(' ', '_')}_${process.env.APORTE_PREFIX}${aporte.id.padStart(5, "0")}.pdf`);

    let resultConvert = await convertAsync(buf, '.pdf', undefined)
    if (resultConvert) {
        fs.writeFileSync(contractPdfPath, resultConvert);
        logger.info("Contrato convertido com sucesso.");

        if (fs.existsSync(contractPdfPath)) {
            let id_drive = await drive.upload(path.basename(contractPdfPath), contractPdfPath);

            if (id_drive) {
                return id_drive;
            } else {
                logger.error(`Erro ao fazer upload do contrato ${process.env.APORTE_PREFIX}${aporte.id.padStart(5, "0")}`);
                return "";
            }
        }
    } else {
        logger.error(`Erro ao converter o contrato ${process.env.APORTE_PREFIX}${aporte.id.padStart(5, "0")} para PDF`);
        return "";
    }

    return "";
}

export default contract_helpers;