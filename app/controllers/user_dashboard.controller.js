import db from "../models/index.js";
const Aportes = db.aportes;
const Transactions = db.transactions;
const UsersSettings = db.usersSettings;
const Users = db.users;
const op = db.Op;
import moment from "moment";
import email_helpers from "../helpers/email_helpers.js";
import Enumerable from "linq";
import number_helpers from "../helpers/number_helpers.js";

const userDashboard = {};

userDashboard.getAportes = (req, res) => {
    const userId = req.params.userId;

    Aportes.findAll({
        where: {
            userId: userId,
            active: true,
        },
        order: [
            ["id", "ASC"],
            [Transactions, "date", "ASC"],
        ],
        include: [
            {
                model: Transactions,
                required: false,
            },
        ],
    })
        .then((aportes) => {
            if (aportes) {
                let results = [];

                aportes.forEach((aporte) => {
                    let result = {
                        id: aporte.id,
                        value: aporte.value,
                        transactions: aporte.transactions,
                        date: aporte.date,
                        contractId: aporte.contractId,
                        locked: aporte.locked,
                        type: aporte.type,
                        monthProfits: [],
                    };

                    let monthProfits = [];
                    let availableProfit = null;

                    aporte.transactions.forEach((transaction) => {
                        if (
                            transaction.type == "saque" ||
                            transaction.type == "novoAporte"
                        ) {
                            availableProfit -= Number(transaction.value);
                        } else if (transaction.type == "rendimento") {
                            availableProfit += Number(transaction.value);
                        }

                        let transactionMonth = moment(
                            transaction.date,
                            "YYYY-MM-DD",
                            true
                        ).startOf("month");

                        let existingMonth = monthProfits.find((x) => x.month.startOf("month").isSame(transactionMonth));

                        if (existingMonth) {
                            existingMonth.profit += +transaction.value;
                        } else if (transactionMonth.startOf("month") < moment().startOf("month")) {
                            monthProfits.push({
                                month: transactionMonth.clone(),
                                profit: +availableProfit + +aporte.value,
                            });
                        }
                    });

                    if (monthProfits.length == 0) {
                        let aporteMonth = moment(
                            aporte.date,
                            "YYYY-MM-DD",
                            true
                        ).startOf("month");

                        monthProfits.push({
                            month: aporteMonth.clone(),
                            profit: +availableProfit + +aporte.value,
                        });
                    }

                    while (monthProfits[monthProfits.length - 1].month.startOf("month") < moment().subtract(1, "M").startOf("month")) {
                        let temp = { ...monthProfits[monthProfits.length - 1] };
                        temp.month = temp.month.clone().add(1, "M");
                        monthProfits.push(temp);

                        if (temp.month.startOf("month").isSame(moment().subtract(1, "M").startOf("month"))) {
                            break;
                        }
                    }

                    result.monthProfits = monthProfits.map((monthProfit) => {
                        return {
                            month: moment()
                                .locale("pt-br")
                                .localeData()
                                .months(
                                    monthProfit.month
                                ),
                            profit: monthProfit.profit,
                        };
                    });
                    result.availableProfit = +availableProfit;
                    results.push(result);
                });

                res.send(results);
            } else {
                const message = `Não foi possivel encontrar os aportes do usuário ${userId}.`;
                req.log.error(message);
                res.status(404).send({
                    message,
                });
            }
        })
        .catch((err) => {
            req.log.error(err);
            res.status(500).send({
                message: `Error retrieving Aportes with id=${userId}`,
            });
        });
};

userDashboard.getAutoReinvest = (req, res) => {
    const userId = req.params.userId;

    UsersSettings.findOne({
        where: {
            userId: userId,
        },
    })
        .then((result) => {
            res.send(result.autoReinvest);
        })
        .catch((err) => {
            req.log.error(err);
            res.status(500).send({
                message: `Error retrieving UsersSettings with id=${userId}`,
            });
        });
};

userDashboard.updateAutoReinvest = (req, res) => {
    const userId = req.params.userId;

    UsersSettings.update(req.body, {
        where: {
            userId: userId,
        },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "UsersSettings was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update UsersSettings with id=${userId}. Maybe UsersSettings was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            req.log.error(err);
            res.status(500).send({
                message: "Error updating UsersSettings with userId=" + userId,
            });
        });
};

userDashboard.newTransaction = async (req, res) => {
    const userId = req.params.userId;

    if (new Date().getDate() > 5) {
        res.status(400).send({
            message: "Periodo inválido.",
        });
        return;
    }

    if (req.body.value.value == 0) {
        res.status(400).send({
            message: "Valor 0(zero).",
        });
        return;
    }

    const withdraws = await Transactions.findOne({
        where: {
            date: {
                [op.between]: [
                    moment().startOf("month").toDate(),
                    moment().endOf("month").toDate(),
                ],
            },
            userId: userId,
            type: "saque",
        },
    });

    if (withdraws !== null) {
        res.status(400).send({
            message: "Saque já realizado esse mês.",
        });
        return;
    }

    Aportes.findAll({
        where: {
            userId: userId,
            active: true,
        },
    }).then((aportes) => {
        let totalValueAportes = aportes.reduce((n, { value }) => {
            return (n += Number(value));
        }, 0);

        let newTransactions = [];

        aportes.forEach((aporte) => {
            let pct = aporte.value / totalValueAportes;
            let value = number_helpers.toFixed(req.body.value.value * pct, 2);

            newTransactions.push({
                userId: userId,
                date: new Date(),
                value: value,
                type: "saque",
                executed: false,
                aporteId: aporte.id,
            });
        });

        newTransactions[newTransactions.length - 1].value +=
            req.body.value.value -
            Enumerable.from(newTransactions).sum((x) => x.value);

        Transactions.bulkCreate(newTransactions, { validate: true })
            .then(() => {
                Users.findOne({
                    where: {
                        id: userId,
                    },
                    include: [
                        {
                            model: db.usersDetails,
                            required: true,
                        },
                    ],
                }).then((user) => {
                    db.transactions
                        .findOne({
                            where: {
                                userId: user.id,
                                type: "saque",
                                executed: false,
                            },
                        })
                        .then((transaction) => {
                            if (process.env.EMAIL_DOMAIN !== undefined) {
                                let date = moment(transaction.createdAt);

                                email_helpers
                                    .send(
                                        `no-reply@${process.env.EMAIL_DOMAIN}`,
                                        `consultoria@${process.env.EMAIL_DOMAIN}`,
                                        `Solicitação de saque - ${user.users_detail.firstName
                                        } ${user.users_detail.lastName
                                        } - ${new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(req.body.value.value)}`,
                                        `<div>Olá gestor,<div><br></div><div>O cliente ${user.users_detail.firstName
                                        } ${user.users_detail.lastName
                                        } solicitou ${new Intl.NumberFormat(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL",
                                            }
                                        ).format(
                                            req.body.value.value
                                        )} em ${date.format(
                                            "DD/MM/YYYY [às] kk:mm[h]"
                                        )}.</div><div><br></div><div>Mensagem do sistema.</div></div>`
                                    )
                                    .then((result) => {
                                        if (!result) {
                                            res.log.error(
                                                "Withdraw email not send"
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        res.log.error(
                                            "Error sending withdraw email: " +
                                            err
                                        );
                                    });
                            }
                        });
                });

                res.send({
                    message: "Saque criado com sucesso.",
                });
            })
            .catch((err) => {
                req.log.error(err);
                res.status(500).send({
                    message: `Erro criando o Saque: ${err}`,
                });
            });
    });
};

userDashboard.getBalanceOfType = async (req, res) => {
    const userId = req.params.userId;
    const aporteType = req.params.aporteType;

    let aporte = await Aportes.findOne({
        where: {
            userId: userId,
            active: true,
            type: aporteType,
        },
        order: [
            ["id", "ASC"],
            [Transactions, "date", "ASC"],
        ],
        include: [
            {
                model: Transactions,
                required: false,
            },
        ],
    });

    if (aporte) {
        let balance = 0;
        aporte.transactions.forEach((transaction) => {
            if (
                transaction.type == "saque" ||
                transaction.type == "novoAporte"
            ) {
                balance -= Number(transaction.value);
            } else if (transaction.type == "rendimento") {
                balance += Number(transaction.value);
            }
        });

        res.send({ balance: balance + +aporte.value });
    } else {
        res.send({ balance: 0 });
    }
};

userDashboard.getUserProfits = async (req, res) => {
    const aporteIds = await Aportes.findAll({
        where: [
            {
                userId: req.params.userId,
                active: true
            },
        ],
        attributes: [
            'id'
        ]
    });

    let profits = (await Transactions.sum('value', {
        where: {
            aporteId: aporteIds.map(aporte => aporte.id),
            type: 'rendimento',
        }
    })) ?? 0;

    res.status(200).send({ profits });
};

userDashboard.getAportesInitialSum = async (req, res) => {
    let aportesSum = (await Aportes.sum('value', {
        where: [
            {
                userId: req.params.userId,
                active: true
            },
        ]
    })) ?? 0;

    res.status(200).send({ aportesSum });
};

export default userDashboard;