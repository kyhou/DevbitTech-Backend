import fs from "fs";
import path from 'path';
import email_helpers from '../helpers/email_helpers.js';
import { v4 as uuidv4 } from 'uuid';
import db from "../models/index.js";

const NewPassword = db.newPassword;
const Users = db.users;
const __dirname = import.meta.dirname;

const forgot_password = {};

forgot_password.send = (req, res) => {
    let templateTemp;
    let filePath = path.join(__dirname, "../templates/emails/forgotPassword.html");

    if (fs.existsSync(filePath)) {
        templateTemp = fs.readFileSync(filePath, 'utf-8');
    } else {
        filePath = path.join(__dirnamem, "../templates/emails/forgotPasswordBackup.html")
        if (fs.existsSync(filePath)) {
            templateTemp = fs.readFileSync(filePath, 'utf-8');
        } else {
            templateTemp = '<html><title>Esqueci minha senha</title><body><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, \'helvetica neue\', helvetica, arial, sans-serif;line-height:27px;color:#666666;font-size:18px">Redefinir sua senha é fácil. Basta pressionar o botão abaixo e seguir as instruções. Vamos deixar tudo pronto e funcionando em pouco tempo.<br type="_moz"></p><br /><a href="LINK_DA_TROCA_DE_SENHA" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;display:inline-block;background:#092e3e;border-radius:2px;font-family:helvetica, \'helvetica neue\', arial, verdana, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center;padding:15px 25px 15px 25px;mso-padding-alt:0;mso-border-alt:10px solid #092E3E">Redefinir Senha</a></body></html>'
        }
    }

    const uuid = uuidv4().toString();

    Users.findOne({
        where: {
            email: req.body.to
        }
    }).then(async user => {
        NewPassword.create({
            key: uuid,
            userId: user.id
        }).then().catch((error) => {
            req.log.error(error);
            res.status(error.status).send({ message: "Erro ao enviar email." });
        });

        let template = templateTemp.replace(/LINK_DA_TROCA_DE_SENHA/g, `https://${process.env.MAIN_DOMAIN}/new-password?key=` + uuid);

        let sendEmailResult = await email_helpers.send(
            `no-reply@${process.env.EMAIL_DOMAIN}`,
            req.body.to,
            "Troca de senha",
            template);

        if (sendEmailResult) {
            res.send({ message: "Email enviado com sucesso!" });
        } else {
            res.status(500).send({ message: "Falha ao enviar o email." });
        }
    });
};

export default forgot_password;