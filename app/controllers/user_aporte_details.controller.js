const db = require("../models");
const Aportes = db.aportes;
const Transactions = db.transactions;
const op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    const aporteId = req.params.aporteId;

    Transactions.findAll({
        where: {
            aporteId: aporteId
        },
        order: [
            ['date', 'DESC'],
            ['id', 'DESC']
        ]
    })
        .then(data => {
            if (data && data.length > 0) {
                res.send(data);
            }
        })
        .catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: `Error retrieving Aportes with id=${aporteId}`
            });
        });
};