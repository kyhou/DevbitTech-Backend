const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  //logging: console.log,
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.app_configs = require("./app_configs.model.js")(sequelize, Sequelize);

db.users = require("./users.model.js")(sequelize, Sequelize);
db.roles = require("./roles.model.js")(sequelize, Sequelize);
db.usersDetails = require("./users_details.model.js")(sequelize, Sequelize);
db.usersSettings = require("./users_settings.model.js")(sequelize, Sequelize);
db.transactions = require("./transactions.model.js")(sequelize, Sequelize);
db.aportes = require("./aportes.model.js")(sequelize, Sequelize);
db.newPassword = require("./new_password.model.js")(sequelize, Sequelize);
db.profits = require("./profits.model.js")(sequelize, Sequelize);
db.refreshToken = require("./refresh_token.model.js")(sequelize, Sequelize);

db.users.hasOne(db.usersDetails);
db.usersDetails.belongsTo(db.users);

db.users.hasOne(db.usersSettings);
db.usersSettings.belongsTo(db.users);

db.roles.belongsToMany(db.users, {
  through: "users_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.users.belongsToMany(db.roles, {
  through: "users_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.users.hasMany(db.aportes);
db.aportes.belongsTo(db.users);

db.aportes.hasMany(db.transactions);
db.transactions.belongsTo(db.aportes);

db.users.hasMany(db.transactions);
db.transactions.belongsTo(db.users);

db.users.hasOne(db.newPassword);
db.newPassword.belongsTo(db.users);

db.aportes.hasMany(db.profits);
db.profits.belongsTo(db.aportes, {
  foreignKey: 'aporteId',
  allowNull: true
});

db.refreshToken.belongsTo(db.users, {
  foreignKey: 'userId', targetKey: 'id'
});
db.users.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});

db.ROLES = ["user", "admin", "colab"];
db.TRANSACTIONS_TYPES = ["saque", "rendimento", "novoAporte"];
db.USER_TYPES = ["select", "invest"];
db.APORTES_TYPES = ["security", "expert"];

module.exports = db;