export default (sequelize, Sequelize) => {
  const Roles = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: {
      type: Sequelize.STRING
    }
  });

  return Roles;
};