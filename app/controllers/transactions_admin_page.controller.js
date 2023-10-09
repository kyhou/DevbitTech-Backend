const db = require("../models");
const Users = db.users;
const Aportes = db.aportes;
const Transactions = db.transactions;
const UsersDetails = db.usersDetails;
const Op = db.Sequelize.Op;
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
const date_helpers = require('../helpers/date_helpers');

exports.returnTransactionsData = (req, res) => {
    const rows = [];

    Transactions.findAll({
        order: [
            ['id', 'DESC'],
        ],
        include: [{
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
    }).then((transactions) => {
        transactions.forEach((transaction) => {
            try {
                if (transaction) {
                    var row = {
                        id: transaction.id,
                        date: date_helpers.parseDate(transaction.date).format("DD/MM/YYYY"),
                        value: formatter.format(transaction.value),
                        pct_profit: transaction.pct_profit ?? "-",
                        newAporteId: transaction.newAporteId ? process.env.APORTE_PREFIX + transaction.newAporteId.padStart(5, "0") : "-",
                        aporteId: transaction.aporteId ? process.env.APORTE_PREFIX + transaction.aporteId.padStart(5, "0") : "-",
                        executed: transaction.executed ? "Sim" : "Não",
                        type: transaction.type
                    };

                    if(transaction.user) {
                        row.user = transaction.user.users_detail.firstName + " " + transaction.user.users_detail.lastName;
                        row.userId = transaction.user.id;
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
            message: 'Error retrieving Transactions'
        });
    });

};

exports.getTransactionData = (req, res) => {
    Transactions.findByPk(req.params.transactionId).then((transaction) => {
        res.status(200).send({ transaction });
    }).catch(err => {
        res.status(500).send({ message: "Transação não encontrada" });
    });
};

exports.updateTransaction = (req, res) => {
    Transactions.findOne({
        where: {
            id: req.body.transaction.id
        }
    }).then((transaction) => {
        transaction.date = req.body.transaction.date;
        transaction.value = req.body.transaction.value;
        transaction.pct_profit = req.body.transaction.type == "rendimento" ? req.body.transaction.pct : null;
        
        if (req.body.transaction.newAporte > 0) {
            transaction.newAporteId = req.body.transaction.newAporte;
        }
        
        transaction.aporteId = req.body.transaction.aporteId;
        transaction.executed = req.body.transaction.executed;
        transaction.userId = req.body.transaction.user;
        transaction.type = req.body.transaction.type;

        transaction.save().then(() => {
            res.send({ message: "Transaction alterado com sucesso." });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: "Erro ao alterar a transação." });
        });
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({ message: "Transaction não encontrado." });
    });
};

exports.newTransaction = (req, res) => {
    Transactions.create({
        date: new Date(req.body.transaction.date),
        value: req.body.transaction.value,
        executed: req.body.transaction.executed,
        userId: req.body.transaction.user,
        aporteId: req.body.transaction.aporte,
        type: req.body.transaction.type,
        pct_profit: req.body.transaction.pct,
        newAporteId: req.body.transaction.newAporte
    }).then(() => {
        res.status(200).send({
            message: "Transaction cadastrado com sucesso!"
        })
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({
            message: "Erro ao cadastrar o transaction."
        })
    });
};


exports.toggleTransactionExecuted = (req, res) => {
    Transactions.findByPk(req.body.transactionId).then((transaction) => {
        transaction.executed = !transaction.executed;
        transaction.save().then(() => {
            res.status(200).send({ message: `Transação alterado status executado para ${transaction.active ? "Sim" : "Não"} com sucesso!` });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: `Erro ao alterar o status executado para ${transaction.active ? "Sim" : "Não"} da transação!` });
        });
    });
};

exports.getUserAportes = (req, res) => {
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