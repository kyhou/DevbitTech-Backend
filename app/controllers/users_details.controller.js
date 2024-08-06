import db from "../models/index.js";
const UsersDetails = db.usersDetails;

const users_details = {};

users_details.findOne = (req, res) => {
    const id = req.params.id;

    UsersDetails.findOne({
        where: {
            userId: id
        }
    }).then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find UsersDetails with id=${id}.`
            });
        }
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: `Error retrieving Users with id=${id}`
        });
    });
};

users_details.findName = (req, res) => {
    const id = req.params.id;

    UsersDetails.findOne({
        where: {
            userId: id
        }
    }).then(data => {
        if (data) {
            res.send({
                firstName: data.firstName,
                lastName: data.lastName
            });
        } else {
            req.log.error(`Não foi possivel encontrar os detalhes do usuário ${id}`);
            res.status(404).send({
                message: `Cannot find UsersDetails with id=${id}.`
            });
        }
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: `Error retrieving Users with id=${id}`
        });
    });
};

users_details.findAll = (req, res) => {
    UsersDetails.findAll({
        order: [
            ['firstName', 'ASC'],
        ]
    }).then(data => {
        if (data) {
            res.send(data);
        } else {
            req.log.error("Nenhum dado encontrado");
            res.status(404).send({
                message: "Nenhum dado encontrado"
            });
        }
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: "Error retrieving UsersDetails"
        });
    });
};

export default users_details;