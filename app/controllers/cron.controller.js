import db from "../models/index.js";
const Aportes = db.aportes;
const Transactions = db.transactions;
const Profits = db.profits;
const Users = db.users;
const UsersDetails = db.usersDetails;
const op = db.Op;

import Enumerable from 'linq';
import moment from 'moment';
import pino from 'pino';
import contract_helpers from '../helpers/contract_helpers.js';

const logger = pino();
const cron = {};
/**
 * Processa os rendimentos de todos os aportes.
 */
cron.processUsersProfits = () => {
    Aportes.findAll({
        where: {
            active: true,
        },
        order: [
            ['id', 'ASC'],
            [Transactions, 'date', 'ASC']
        ],
        include: [{
            model: Transactions,
            required: false,
            where: {
                type: "rendimento"
            }
        }],
    }).then(aportes => {
        aportes.forEach(aporte => {
            if (!Enumerable.from(aporte.transactions).where(x => moment(x.date).isSame(moment().subtract(1, 'months').endOf('month').startOf('day'), 'day')).any()) {
                Users.findOne({
                    where: {
                        id: aporte.userId,
                        active: true,
                    }
                }).then(() => {
                    Profits.findAll({
                        where: {
                            aporteId: {
                                [op.or]: {
                                    [op.eq]: aporte.id,
                                    [op.is]: null
                                }
                            },
                            startDate: {
                                [op.lte]: new Date()
                            },
                            endDate: {
                                [op.or]: {
                                    [op.gte]: new Date(),
                                    [op.is]: null
                                }
                            }
                        },
                        order: [
                            ['startDate', 'DESC']
                        ]
                    }).then(profits => {
                        let profitValue;

                        let profit = Enumerable.from(profits)
                            .where(x => x.aporteId != null)
                            .firstOrDefault();

                        if (!profit) {
                            profit = Enumerable.from(profits)
                                .where(x => x.aporteId == null)
                                .firstOrDefault();

                            profitValue = Number(profit.value);

                            if (aporte.locked) {
                                profitValue += 1;
                            }
                        } else {
                            profitValue = Number(profit.value);
                        }

                        if (profit) {
                            if (profitValue > 0) {
                                let newTransaction = {
                                    userId: aporte.userId,
                                    date: moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'),
                                    type: "rendimento",
                                    executed: true,
                                    aporteId: aporte.id,
                                    pct_profit: profitValue,
                                    value: 0
                                };

                                if (aporte.transactions.length > 0) {
                                    newTransaction.value = aporte.value * (newTransaction.pct_profit / 100);
                                } else {
                                    const lastDayPeriod = moment().subtract(1, 'months').endOf('month');
                                    const aporteStartDate = moment(aporte.date, "YYYY-MM-DD");
                                    const daysInMonth = lastDayPeriod.daysInMonth();
                                    const dayAporte = aporteStartDate.date() > daysInMonth ? daysInMonth : aporteStartDate.date();
                                    const aporteNewDate = moment(`${moment().year()}-${lastDayPeriod.month() + 1}-${dayAporte}`, "YYYY-MM-DD");
                                    const days = lastDayPeriod.diff(aporteNewDate, 'days') + 1;
                                    const value = (aporte.value * (profitValue / 100) / daysInMonth) * days;

                                    newTransaction.value = value;
                                }

                                Transactions.create(newTransaction).then(() => {
                                    logger.info({ msg: "Nova transação de rendimento criada com sucesso", transaction: newTransaction });
                                }).catch(err => {
                                    logger.error({ msg: "Falha na criação da transação", err });
                                });
                            } else {
                                logger.info(`Rendimento 0% para o aporte ${aporte.id}`);
                            }
                        } else {
                            logger.fatal(`Nenhum rendimento cadastrado para o aporte ${aporte.id}`);
                        }
                    }).catch(err => {
                        logger.fatal(err);
                    });
                });
            }
        });
    });
}

/**
 * Processa os novos aportes dos rendimentos acima de 500 reais dos usuários.
 */
cron.processNewAportes = () => {
    Users.findAll({
        where: {
            active: true,
        },
        include: [
            {
                model: UsersDetails,
                required: true
            },
            {
                model: Aportes,
                where: {
                    active: true
                },
                required: true,
                include: [
                    {
                        model: Transactions,
                        required: false,
                    },
                    {
                        model: Profits,
                        required: false,
                    }
                ]
            }
        ]
    }).then(users => {
        users.forEach(user => {
            let aportes1y = new Enumerable.from(user.aportes).where(x => !x.locked).toArray();
            let aportes2y = new Enumerable.from(user.aportes).where(x => x.locked).toArray();

            newAporte(aportes1y, "contrato_select_site");
            newAporte(aportes2y, "contrato_select_site_2_anos");

            /**
             * The function creates a new aporte and generates a contract document if
             * the total value of the contributions is greater than or equal to 500.
             * @param {Array} aportes an array of objects representing the user's current aportes
             * @param {String} template The template is used to generate a contract document.
             * @returns {void}
             */
            function newAporte(aportes, template) {
                let totalValue = 0;

                aportes.forEach(aporte => {
                    aporte.transactions.forEach(aporteTransaction => {
                        if (aporteTransaction.type == "saque" || aporteTransaction.type == "novoAporte") {
                            totalValue -= Number(aporteTransaction.value);
                        }

                        if (aporteTransaction.type == "rendimento") {
                            totalValue += Number(aporteTransaction.value);
                        }
                    });
                });

                if (totalValue >= 500) {
                    let locked = new Enumerable.from(aportes).select(x => x.locked).firstOrDefault();

                    const newAporte = {
                        date: new Date().setDate(1),
                        value: totalValue,
                        active: true,
                        locked,
                        userId: user.id
                    };

                    Aportes.create(newAporte).then((aporte) => {
                        logger.info(`Aporte ${process.env.APORTE_PREFIX}${aporte.id.padStart(5, "0")} gerado com sucesso.`);

                        let profits = new Enumerable.from(aportes)
                            .selectMany(x => x.profits)
                            .toArray();
                        let profit = new Enumerable.from(profits)
                            .where(x => moment(x.startDate).startOf('day').isSameOrBefore(moment().startOf('day')))
                            .orderByDescending(x => x.startDate)
                            .select(x => x)
                            .firstOrDefault();

                        if (profit) {
                            let newProfit = {
                                date: profit.date,
                                startDate: profit.startDate,
                                endDate: profit.endDate,
                                value: profit.value,
                                aporteId: aporte.id,
                            }

                            Profits.create(newProfit);
                        }

                        aportes.forEach(userAporte => {
                            let totalValueAporte = 0;
                            userAporte.transactions.forEach(aporteTransaction => {
                                if (aporteTransaction.type == "saque" || aporteTransaction.type == "novoAporte") {
                                    totalValueAporte -= Number(aporteTransaction.value);
                                }

                                if (aporteTransaction.type == "rendimento") {
                                    totalValueAporte += Number(aporteTransaction.value);
                                }
                            });

                            if (totalValueAporte > 0) {
                                const newTransaction = {
                                    userId: user.id,
                                    date: new Date(),
                                    value: totalValueAporte,
                                    type: "novoAporte",
                                    executed: true,
                                    aporteId: userAporte.id,
                                    newAporteId: aporte.id
                                };

                                Transactions.create(newTransaction)
                                    .then(() => {
                                        logger.info(`Transação criada com sucesso.`);
                                    })
                                    .catch((error) => {
                                        logger.error(error);
                                    });
                            }
                        });

                        contract_helpers.generateContractDocx(aporte, user.users_detail, totalValue, template, logger);
                    }).catch((err) => {
                        logger.error(err);
                    });
                }
            }
        });
    }).catch(err => {
        logger.error(err);
    });
}

export default cron_controller;