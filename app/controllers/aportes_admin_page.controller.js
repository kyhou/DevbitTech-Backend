//@ts-check
const db = require("../models");
const Users = db.users;
const Aportes = db.aportes;
const UsersDetails = db.usersDetails;
const Profits = db.profits;
const Op = db.Sequelize.Op;
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
const date_helpers = require('../helpers/date_helpers');
const Enumerable = require('linq');
const moment = require('moment');
const contract_helpers = require('../helpers/contract_helpers');
const AportesController = require('../controllers/aportes.controller');

/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 */

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.returnAportesData = (req, res) => {
    const rows = [];

    Aportes.findAll({
        include: [{
            model: Users,
            include: [
                {
                    model: UsersDetails,
                    required: true,
                },
            ],
            required: true
        },
        {
            model: Profits,
            required: false,
        }
        ],
    }).
        then((/** @type {any[]} */ aportes) => {
            aportes.forEach((aporte) => {
                try {
                    if (aporte) {
                        let profits = Enumerable.from(aporte.profits).where((/** @type {any} */ x) => x.startDate <= moment().format("YYYY-MM-DD") && (x.endDate >= moment().format("YYYY-MM-DD") || x.endDate == null)).orderByDescending((/** @type {any} */ x) => x.startDate).thenBy((/** @type {any} */ x) => x.aporteId).firstOrDefault();

                        var row = {
                            id: process.env.APORTE_PREFIX + aporte.id.padStart(5, "0"),
                            date: date_helpers.parseDate(aporte.date).format("DD/MM/YYYY"),
                            value: formatter.format(aporte.value),
                            locked: aporte.locked,
                            userId: aporte.user.id,
                            user: aporte.user.users_detail.firstName + " " + aporte.user.users_detail.lastName,
                            active: aporte.active,
                            profit: profits !== undefined ? profits.value + '%' : "-",
                            contractId: aporte.contractId,
                        };

                        rows.push(row);
                    } else {
                        req.log.error(`Aporte ${aporte.id} não encontrado.`);
                        res.status(404).send({
                            message: `Cannot find Aporte with id=${aporte.id}.`
                        });
                    }
                } catch (e) {
                    throw e;
                }
            });

            res.send(rows);
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: 'Error retrieving Aportes'
            });
        });

};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.updateAporte = (req, res) => {
    Aportes.findOne({
        where: {
            id: Number(req.body.aporte.id.replace(/[^0-9]/g, ''))
        }
    }).then((/** @type {any} */ aporte) => {
        aporte.userId = req.body.aporte.user;
        aporte.date = req.body.aporte.date;
        aporte.value = req.body.aporte.value;
        aporte.locked = req.body.aporte.locked;
        aporte.active = req.body.aporte.active;

        aporte.save().then(() => {
            res.send({ message: "Aporte alterado com sucesso." });
        }).catch(err => {
            res.status(500).send({ message: "Erro ao alterar o aporte." });
        });
    }).catch(err => {
        console.error(err);
        res.status(500).send({ message: "Aporte não encontrado." });
    });
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.newAporte = (req, res) => {
    Aportes.create({
        date: new Date(req.body.aporte.date),
        value: req.body.aporte.value,
        active: req.body.aporte.active ?? true,
        locked: req.body.aporte.locked ?? false,
        userId: req.body.aporte.user,
        type: req.body.aporte.type
    }).then(() => {
        res.status(200).send({
            message: "Aporte cadastrado com sucesso!"
        })
    }).catch(err => {
        console.error(err);
        res.status(500).send({
            message: "Erro ao cadastrar o aporte."
        })
    });
};

/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
exports.generateContract = async (req, res) => {
    let aporteId = Number(req.body.aporteId.replace(/[^0-9]/g, ''));

    let aporte = await Aportes.findOne({
        where: {
            id: aporteId
        },
        include: [
            {
                model: Users,
                include: [
                    {
                        model: UsersDetails,
                        required: true,
                    },
                ],
                required: true
            }
        ]
    })
    
    if (aporte) {
        let template = aporte.locked ? "contrato_select_site_2_anos" : "contrato_select_site";
        let id = await contract_helpers.generateContractDocx(aporte, aporte.user.users_detail, 1, template, req.log);
        if (id) {
            let result = await AportesController.updateContractId(aporteId, id, req.log);

            if (result) {
                res.status(200).send({ message: "Contrato gerado com sucesso.", contractId: id });
            } else {
                res.status(500).send({ message: "Erro ao atualizar id do contrato no registro do aporte." });
            }
        } else {
            res.status(500).send({ message: "Erro ao gerar contrato" });
        }
    }
};