const db = require("../models");
const Profits = db.profits;
const Aportes = db.aportes;
const op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    Profits.findAll({
        order: [["startDate", "DESC"]],
    })
        .then((data) => {
            if (data && data.length > 0) {
                res.send(data);
            } else {
                res.send([]);
            }
        })
        .catch((err) => {
            req.log.error(err);
            res.status(500).send({
                message: "Erro ao retornar os registros.",
            });
        });
};

exports.findAllUserProfits = async (req, res) =>  {
    const aporteIds = await Aportes.findAll({
        where: [
            {
                userId: req.params.userId,
                type: 'expert',
            },
        ],
        attributes: [
            'id'
        ]
    });

    Profits.findAll({
        where: [
            {
                aporteId: aporteIds.map(aporte => aporte.id),
            },
        ],
        order: [["startDate", "DESC"]],
    })
        .then((data) => {
            if (data && data.length > 0) {
                res.send(data);
            } else {
                res.send([]);
            }
        })
        .catch((err) => {
            req.log.error(err);
            res.status(500).send({
                message: "Erro ao retornar os registros.",
            });
        });
};
