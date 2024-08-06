export default (sequelize, Sequelize) => {
    const Profits = sequelize.define("profits", {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        startDate: {
            type: Sequelize.DATEONLY,
            allowNull: false,
        },
        endDate: {
            type: Sequelize.DATEONLY
        },
        value: {
            type: Sequelize.DECIMAL(4, 2),
            allowNull: false,
        },
        aporteId: {
            type: Sequelize.BIGINT,
            references: {
                model: 'aportes',
                key: 'id'
            }
        }
    });

    return Profits;
};