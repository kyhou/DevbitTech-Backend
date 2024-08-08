import db from "../models/index.js";
const Users = db.users;
const Aportes = db.aportes;
const Profits = db.profits;
const UsersDetails = db.usersDetails;
const op = db.Op;
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
import date_helpers from '../helpers/date_helpers.js';
import moment from 'moment';

const profits_page = {};

profits_page.returnProfitsData = (req, res) => {
    const rows = [];

    Profits.findAll({
        order: [
            ['startDate', 'DESC'],
            ['id', 'DESC'],
        ],
        include: [
            {
                model: Aportes,
                include: [
                    {
                        model: Users,
                        include: [
                            {
                                model: UsersDetails,
                                required: true,
                            },
                        ],
                        required: false
                    },
                ],
            }
        ],
    }).then((profits) => {
        profits.forEach((profit) => {
            try {
                if (profit) {
                    let endDate = profit.endDate != null ? date_helpers.parseDate(profit.endDate).format("DD/MM/YYYY") : "-";

                    let row = {
                        id: profit.id,
                        startDate: date_helpers.parseDate(profit.startDate).format("DD/MM/YYYY"),
                        endDate: endDate,
                        value: profit.value ?? "-",
                        aporteId: profit.aporteId ? process.env.APORTE_PREFIX + profit.aporteId.padStart(5, "0") : "-",
                    };

                    if (profit.aporte?.user) {
                        row.user = profit.aporte.user.users_detail.firstName + " " + profit.aporte.user.users_detail.lastName;
                        row.userId = profit.aporte.user.id;
                    } else {
                        row.user = "-";
                    }

                    rows.push(row);
                }
            } catch (e) {
                throw e;
            }
        });

        res.send(rows);
    }).catch(err => {
        res.status(500).send({
            message: 'Error retrieving Profits'
        });
    });

};

profits_page.getProfitData = (req, res) => {
    Profits.findByPk(req.params.profitId).then((profit) => {
        res.status(200).send({ profit });
    }).catch(err => {
        res.status(500).send({ message: "Transação não encontrada" });
    });
};

profits_page.updateProfit = (req, res) => {
    Profits.findOne({
        where: {
            id: req.body.profit.id
        }
    }).then((profit) => {
        profit.startDate = req.body.profit.startDate;
        profit.endDate = moment(req.body.profit.endDate, "YYYY-MM-DD").isValid() ? req.body.profit.endDate : null;
        profit.value = req.body.profit.pct;
        profit.aporteId = req.body.profit.aporteId;

        profit.save().then(() => {
            res.send({ message: "Profit alterado com sucesso." });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: "Erro ao alterar a transação." });
        });
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({ message: "Profit não encontrado." });
    });
};

profits_page.newProfit = (req, res) => {
    Profits.create({
        startDate: moment(req.body.profit.startDate),
        endDate: req.body.profit.endDate != undefined ? new Date(req.body.profit.endDate) : null,
        aporteId: req.body.profit.aporte,
        value: req.body.profit.pct,
    })
        .then(
            result => {
                res.status(200).send({
                    message: "Vigência cadastrada com sucesso!"
                })
            },
            error => {
                req.log.error(error);
                res.status(500).send({
                    message: "Falha ao cadastrar vigência."
                })
            })
        .catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: "Erro ao cadastrar a vigência."
            })
        });
};

profits_page.getUserAportes = (req, res) => {
    Aportes.findAll({
        where: {
            userId: req.params.userId
        },
        attributes: [
            'id'
        ]
    }).then((aportes) => {
        res.status(200).send({ aportes });
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({ message: 'Erro ao buscar os aportes do usuário.' });
    });
};

export default profits_page;