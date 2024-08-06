export default (sequelize, Sequelize) => {
  const UsersSettings = sequelize.define("users_settings", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    autoReinvest: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    type: {
      type: Sequelize.ENUM("select", "invest")
    }
  },
  );

  return UsersSettings;
};