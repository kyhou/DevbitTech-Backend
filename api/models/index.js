import { Sequelize, Op } from "sequelize";
import dbConfig from "../config/db.config.js";
import pg from "pg";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: console.log,
  dialectModule: pg,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   }
  // },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});


const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

import AppConfigs from "./app_configs.model.js";
db.app_configs = AppConfigs(sequelize, Sequelize);

import Users from "./users.model.js";
db.users = Users(sequelize, Sequelize);

import Roles from "./roles.model.js";
db.roles = Roles(sequelize, Sequelize);

import UsersDetails from "./users_details.model.js";
db.usersDetails = UsersDetails(sequelize, Sequelize);

import UsersSettings from "./users_settings.model.js";
db.usersSettings = UsersSettings(sequelize, Sequelize);

import Transactions from "./transactions.model.js";
db.transactions = Transactions(sequelize, Sequelize);

import Aportes from "./aportes.model.js";
db.aportes = Aportes(sequelize, Sequelize);

import NewPassword from "./new_password.model.js";
db.newPassword = NewPassword(sequelize, Sequelize);

import Profits from "./profits.model.js";
db.profits = Profits(sequelize, Sequelize);

import RefreshToken from "./refresh_token.model.js";
db.refreshToken = RefreshToken(sequelize, Sequelize);

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

export default db;