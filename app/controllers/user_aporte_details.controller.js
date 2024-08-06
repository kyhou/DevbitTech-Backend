import db from "../models/index.js";
const Transactions = db.transactions;

const UserAporteDetails = {};

UserAporteDetails.findAll = (req, res) => {
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

export default UserAporteDetails;