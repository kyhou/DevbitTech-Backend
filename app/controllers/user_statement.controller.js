const db = require("../models");
const Aportes = db.aportes;
const Transactions = db.transactions;
const op = db.Sequelize.Op;
const Enumerable = require('linq');

exports.findAll = (req, res) => {
    const userId = req.params.userId;

    Transactions.findAll({
        where: {
            userId: userId
        },
        order: [
            ['date', 'DESC'],
            ['id', 'DESC']
        ]
    })
        .then(data => {
            if (data && data.length > 0) {
                var results = [];

                var transactionsByMonth = Enumerable.from(data)
                    .groupBy("reg => new Date(reg.date + 'T00:00:00-03:00').getMonth()")
                    .select("{key:$.key(),value:$.toArray()}")
                    .toArray();

                transactionsByMonth.forEach(month => {
                    var transactions = Enumerable.from(month.value);

                    var withdrawValue = transactions.where(x => x.type == "saque").sum(n => Number(n.value));
                    var profitValue = transactions.where(x => x.type == "rendimento").sum(n => Number(n.value));
                    var newAporteValue = transactions.where(x => x.type == "novoAporte").sum(n => Number(n.value));
                    var pctProfit = transactions.where(x => x.type == "rendimento").select(x => x.pct_profit).firstOrDefault();

                    if (transactions.any(x => x.type == "novoAporte")) {
                        results.push({
                            type: "novoAporte",
                            date: transactions.where(x => x.type == "novoAporte").select(x => x.date).firstOrDefault(),
                            value: newAporteValue,
                            executed: false,
                            newAporteId: transactions.where(x => x.type == "novoAporte" && x.newAporteId).select(x => x.newAporteId).firstOrDefault() ?? '-',
                        });
                    }

                    if (transactions.any(x => x.type == "saque")) {
                        results.push({
                            type: "saque",
                            date: transactions.where(x => x.type == "saque").select(x => x.date).firstOrDefault(),
                            value: withdrawValue,
                            executed: false,
                            newAporteId: '-'
                        });
                    }

                    if (transactions.any(x => x.type == "rendimento")) {
                        results.push({
                            type: "rendimento",
                            date: transactions.where(x => x.type == "rendimento").select(x => x.date).firstOrDefault(),
                            value: profitValue,
                            pct_profit: pctProfit,
                            executed: false,
                            newAporteId: '-'
                        });
                    }
                });

                res.send(Enumerable.from(results).orderByDescending(x => x.date).toArray());
            } else {
                req.log.error(`Não foi possivel encontrar as transações para o usuário ${userId}`);
                res.status(404).send({
                    message: `Cannot find Transactions with id=${userId}.`
                });
            }
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: `Error retrieving transactions for the user ${userId}`
            });
        });
};