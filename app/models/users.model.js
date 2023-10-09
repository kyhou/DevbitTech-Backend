module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    active: {
      type: Sequelize.BOOLEAN
    },
    message: {
      type: Sequelize.TEXT
    }
  });

  return Users;
};