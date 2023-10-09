const db = require("../models");
const NewPassword = db.newPassword;
const Users = db.users;
const op = db.Sequelize.Op;
const fs = require("fs");
const path = require('path');
const email_helpers = require('../helpers/email_helpers');
const { v4: uuidv4 } = require('uuid');

exports.send = (req, res) => {
    var templateTemp = fs.readFileSync(path.join(__dirname, `../templates/emails/forgotPassword.html`), 'utf-8');

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

        var template = templateTemp.replace(/LINK_DA_TROCA_DE_SENHA/g, `https://${process.env.MAIN_DOMAIN}/new-password?key=` + uuid);

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