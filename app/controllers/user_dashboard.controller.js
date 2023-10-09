const db = require("../models");
const Aportes = db.aportes;
const Transactions = db.transactions;
const UsersSettings = db.usersSettings;
const Users = db.users;
const op = db.Sequelize.Op;
const moment = require('moment');
const email_helpers = require('../helpers/email_helpers');
const Enumerable = require('linq');
const number_helpers = require('../helpers/number_helpers');

exports.getAportes = (req, res) => {
    const DateHelpers = require("../helpers/date_helpers");
    const userId = req.params.userId;

    Aportes.findAll({
        where: {
            userId: userId,
            active: true,
        },
        order: [
            ['id', 'ASC'],
            [Transactions, 'date', 'ASC']
        ],
        include: [{
            model: Transactions,
            required: false
        }],
    }).then(aportes => {
        if (aportes) {
            var results = [];

            aportes.forEach(aporte => {
                var result = {
                    id: aporte.id,
                    value: aporte.value,
                    transactions: aporte.transactions,
                    date: aporte.date,
                    contractId: aporte.contractId,
                    locked: aporte.locked,
                };

                var availableProfit = null;

                aporte.transactions.forEach(transaction => {
                    if (transaction.type == 'saque' || transaction.type == 'novoAporte') {
                        availableProfit -= Number(transaction.value);
                    } else if (transaction.type == 'rendimento') {
                        availableProfit += Number(transaction.value);
                    }
                });

                result.availableProfit = availableProfit;
                results.push(result);
            });

            res.send(results);
        } else {
            req.log.error(`Não foi possivel encontrar os aportes do usuário ${userId}`);
            res.status(404).send({
                message: `Não foi possivel encontrar os aportes do usuário ${userId}.`
            });
        }
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: `Error retrieving Aportes with id=${userId}`
        });
    });
}

exports.getAutoReinvest = (req, res) => {
    const userId = req.params.userId;

    UsersSettings.findOne({
        where: {
            userId: userId
        }
    }).then(result => {
        res.send(result.autoReinvest);
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: `Error retrieving UsersSettings with id=${userId}`
        });
    })
}

exports.updateAutoReinvest = (req, res) => {
    const userId = req.params.userId;

    UsersSettings.update(req.body,
        {
            where: {
                userId: userId
            }
        }
    ).then(num => {
        if (num == 1) {
            res.send({
                message: "UsersSettings was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update UsersSettings with id=${userId}. Maybe UsersSettings was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: "Error updating UsersSettings with userId=" + userId
        });
    });
}

exports.newTransaction = async (req, res) => {
    const userId = req.params.userId;

    if (new Date().getDate() > 5) {
        res.status(400).send({
            message: "Periodo inválido."
        });
        return;
    }

    if (req.body.value.value == 0) {
        res.status(400).send({
            message: "Valor 0(zero)."
        });
        return;
    }

    const withdraws = await Transactions.findOne({
        where: {
            date: {
                [op.between]: [
                    moment().startOf('month').toDate(),
                    moment().endOf('month').toDate()
                ]
            },
            userId: userId,
            type: "saque"
        }
    });

    if (withdraws !== null) {
        res.status(400).send({
            message: "Saque já realizado esse mês."
        });
        return;
    }

    Aportes.findAll({
        where:
        {
            userId: userId,
            active: true
        }
    }).then((aportes) => {
        var totalValueAportes = aportes.reduce((n, { value }) => {
            return n += Number(value);
        }, 0);

        var newTransactions = [];

        aportes.forEach(aporte => {
            var pct = aporte.value / totalValueAportes;
            var value = number_helpers.toFixed(req.body.value.value * pct, 2);

            newTransactions.push({
                userId: userId,
                date: new Date(),
                value: value,
                type: "saque",
                executed: false,
                aporteId: aporte.id
            });
        });

        newTransactions[newTransactions.length - 1].value += (req.body.value.value - Enumerable.from(newTransactions).sum(x => x.value));

        Transactions.bulkCreate(newTransactions, { validate: true }).then(() => {
            Users.findOne({
                where: {
                    id: userId
                },
                include: [{
                    model: db.usersDetails,
                    required: true
                }]
            }).then((user) => {
                db.transactions.findOne({
                    where: {
                        userId: user.id,
                        type: "saque",
                        executed: false
                    }
                }).then((transaction) => {
                    let date = moment(transaction.createdAt);

                    email_helpers.send(
                        `no-reply@${process.env.EMAIL_DOMAIN}`,
                        `consultoria@${process.env.EMAIL_DOMAIN}`,
                        `Solicitação de saque - ${user.users_detail.firstName} ${user.users_detail.lastName} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.body.value.value)}`,
                        `<div>Olá gestor,<div><br></div><div>O cliente ${user.users_detail.firstName} ${user.users_detail.lastName} solicitou ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(req.body.value.value)} em ${date.format("DD/MM/YYYY [às] kk:mm[h]")}.</div><div><br></div><div>Mensagem do sistema.</div></div>`
                    ).then((result) => {
                        if (!result) {
                            res.log.error("Withdraw email not send");
                        }
                    }).catch((err) => {
                        res.log.error("Error sending withdraw email: " + err);
                    });
                });
            });

            res.send({
                message: "Saque criado com sucesso."
            });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: `Erro criando o Saque: ${err}`
            });
        });
    });
}