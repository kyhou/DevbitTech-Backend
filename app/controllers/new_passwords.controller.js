const db = require("../models");
const NewPassword = db.newPassword;
const Op = db.Sequelize.Op;

exports.findOne = (req, res) => {
    NewPassword.findOne({
        where: {
            key: req.params.key
        }
    }).then((result) => {
        if (result) {
            res.status(200).send({ found: true });
        } else {
            res.status(200).send({ found: false });
        }
    }).catch((err) => {
        req.log.error(err);
        res.status(500).send({ message: "Chave inválida."});
    });
};