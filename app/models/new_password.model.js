module.exports = (sequelize, Sequelize) => {
    const NewPassword = sequelize.define("new_password", {
        key: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
    });

    return NewPassword;
};