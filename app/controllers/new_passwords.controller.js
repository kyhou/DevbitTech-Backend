import db from "../models/index.js";
const new_password = db.newPassword;

const NewPassword = {};

NewPassword.findOne = (req, res) => {
    new_password.findOne({
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

export default NewPassword