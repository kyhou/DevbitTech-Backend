module.exports = (sequelize, Sequelize) => {
    const AppConfigs = sequelize.define("app_configs",
        {
            key: {
                type: Sequelize.STRING,
                primaryKey: true
            },
            value: {
                type: Sequelize.STRING
            },
        },
        {
            timestamps: false
        });

    return AppConfigs;
};