import db from "../models/index.js";
const Users = db.users;
const Aportes = db.aportes;
const Transactions = db.transactions;
const UsersDetails = db.usersDetails;
const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
import date_helpers from '../helpers/date_helpers.js';
import Enumerable from 'linq';

const withdraws_page = {};

withdraws_page.returnWithdraws = (req, res) => {
    const rows = [];

    Transactions.findAll({
        where: {
            type: 'saque',
            executed: false
        },
        order: [
            ['id', 'DESC'],
        ],
        include: [{
            model: Users,
            include: [
                {
                    model: UsersDetails,
                    required: true,
                }],
            required: false
        }],
    }).then((transactions) => {
        let groupedTransactions = Enumerable.from(transactions).groupBy(x => x.userId,
            x => x,
            (key, element) => {
                return { key, elements: element.getSource() };
            }
        );

        groupedTransactions.forEach((group) => {
            try {
                var name = Enumerable.from(group.elements).select(x => x.user.users_detail.firstName + ' ' + x.user.users_detail.lastName).firstOrDefault();
                var totalValue = Enumerable.from(group.elements).sum(x => Number(x.value));

                var row0 = {
                    userId: group.key,
                    name,
                    value: formatter.format(totalValue),
                    executed: "Não",
                    level: 0
                }

                rows.push(row0);

                group.elements.forEach((transaction) => {
                    if (transaction) {
                        var row1 = {
                            id: transaction.id,
                            date: date_helpers.parseDate(transaction.date).format("DD/MM/YYYY"),
                            value: formatter.format(transaction.value),
                            executed: transaction.executed ? "Sim" : "Não",
                            level: 1,
                            name: process.env.APORTE_PREFIX + transaction.aporteId.padStart(5, "0"),
                            userId: transaction.user.id
                        };

                        rows.push(row1);
                    }
                });
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

withdraws_page.toggleTransactionExecuted = (req, res) => {
    Transactions.findByPk(req.body.transactionId).then((transaction) => {
        transaction.executed = !transaction.executed;
        transaction.save().then(() => {
            res.status(200).send({ message: `Saque alterado status executado para ${transaction.active ? "Sim" : "Não"} com sucesso!` });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: `Erro ao alterar o status do saque executado para ${transaction.active ? "Sim" : "Não"} da transação!` });
        });
    });
};

withdraws_page.toggleUserTransactionsExecuted = async (req, res) => {
    try {
        db.sequelize.transaction(async (t) => {
            Transactions.findAll({
                where: {
                    id: {
                        [Op.in]: req.body.withdrawsIds,
                    },
                    type: 'saque',
                }
            }).then(async (withdraws) => {
                for await (const withdraw of withdraws) {
                    withdraw.executed = !withdraw.executed;
                    await withdraw.save();
                }

                res.status(200).send(Enumerable.from(withdraws).select(x => x.id).toArray());
            }).catch((err) => {
                res.log.error("Error toggling withdraw: " + err)
            });
        })
    } catch (error) {
        res.log.error("Error in the function toggleUserTransactionsExecuted. -> " + error)
    }
};

export default withdraws_page;