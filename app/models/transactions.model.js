module.exports = (sequelize, Sequelize) => {
    const Transactions = sequelize.define("transactions", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: Sequelize.DATEONLY
        },
        value: {
            type: Sequelize.DECIMAL(15, 2)
        },
        pct_profit: {
            type: Sequelize.DECIMAL(4, 2)
        },
        type: {
            type: Sequelize.ENUM("saque", "rendimento", "novoAporte")
        },
        executed:
        {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        newAporteId: {
            type: Sequelize.BIGINT,
            references: {
                model: 'aportes',
                key: 'id'
            }
        }
    });

    return Transactions;
};