module.exports = (sequelize, Sequelize) => {
    const Aportes = sequelize.define("aportes",
        {
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
            active: {
                type: Sequelize.BOOLEAN
            },
            locked: {
                type: Sequelize.BOOLEAN
            },
            contractId: {
                type: Sequelize.STRING
            },
            type: {
                type: Sequelize.ENUM("security", "expert")
            }
        });

    return Aportes;
};