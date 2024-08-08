const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "app_configs", deps: []
 * createTable() => "users", deps: []
 * createTable() => "roles", deps: []
 * createTable() => "users_details", deps: [users]
 * createTable() => "users_settings", deps: [users]
 * createTable() => "aportes", deps: [users]
 * createTable() => "transactions", deps: [aportes, aportes, users]
 * createTable() => "new_passwords", deps: [users]
 * createTable() => "profits", deps: [aportes]
 * createTable() => "refreshTokens", deps: [users]
 * createTable() => "users_roles", deps: [roles, users]
 *
 */

const info = {
  revision: 1,
  name: "deploy",
  created: "2024-08-04T03:27:40.344Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "app_configs",
      {
        key: { type: Sequelize.STRING, field: "key", primaryKey: true },
        value: { type: Sequelize.STRING, field: "value" },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          type: Sequelize.BIGINT,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        email: { type: Sequelize.STRING, field: "email" },
        password: { type: Sequelize.STRING, field: "password" },
        active: { type: Sequelize.BOOLEAN, field: "active" },
        message: { type: Sequelize.TEXT, field: "message" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "roles",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        description: { type: Sequelize.STRING, field: "description" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users_details",
      {
        id: {
          type: Sequelize.BIGINT,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: { type: Sequelize.STRING, field: "firstName" },
        lastName: { type: Sequelize.STRING, field: "lastName" },
        document: { type: Sequelize.STRING, field: "document" },
        documentType: {
          type: Sequelize.ENUM("CPF", "CNPJ"),
          field: "documentType",
        },
        phone: { type: Sequelize.STRING, field: "phone" },
        maritalStatus: {
          type: Sequelize.ENUM(
            "Casado(a)",
            "Solteiro(a)",
            "Viúvo(a)",
            "Divorciado(a)",
            "Separado(a)"
          ),
          field: "maritalStatus",
        },
        profession: { type: Sequelize.STRING, field: "profession" },
        address: { type: Sequelize.STRING, field: "address" },
        number: { type: Sequelize.INTEGER, field: "number" },
        complement: { type: Sequelize.STRING, field: "complement" },
        district: { type: Sequelize.STRING, field: "district" },
        zipCode: { type: Sequelize.STRING, field: "zipCode" },
        city: { type: Sequelize.STRING, field: "city" },
        uf: { type: Sequelize.STRING, field: "uf" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users_settings",
      {
        id: {
          type: Sequelize.BIGINT,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        autoReinvest: {
          type: Sequelize.BOOLEAN,
          field: "autoReinvest",
          defaultValue: true,
        },
        type: { type: Sequelize.ENUM("select", "invest"), field: "type" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "aportes",
      {
        id: {
          type: Sequelize.BIGINT,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        date: { type: Sequelize.DATEONLY, field: "date" },
        value: { type: Sequelize.DECIMAL(15, 2), field: "value" },
        active: { type: Sequelize.BOOLEAN, field: "active" },
        locked: { type: Sequelize.BOOLEAN, field: "locked" },
        contractId: { type: Sequelize.STRING, field: "contractId" },
        type: { type: Sequelize.ENUM("security", "expert"), field: "type" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "transactions",
      {
        id: {
          type: Sequelize.BIGINT,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        date: { type: Sequelize.DATEONLY, field: "date" },
        value: { type: Sequelize.DECIMAL(15, 2), field: "value" },
        pct_profit: { type: Sequelize.DECIMAL(4, 2), field: "pct_profit" },
        type: {
          type: Sequelize.ENUM("saque", "rendimento", "novoAporte"),
          field: "type",
        },
        executed: {
          type: Sequelize.BOOLEAN,
          field: "executed",
          defaultValue: true,
        },
        newAporteId: {
          type: Sequelize.BIGINT,
          field: "newAporteId",
          references: { model: "aportes", key: "id" },
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        aporteId: {
          type: Sequelize.BIGINT,
          field: "aporteId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "aportes", key: "id" },
          allowNull: true,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "new_passwords",
      {
        key: { type: Sequelize.STRING, field: "key", primaryKey: true },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "profits",
      {
        id: {
          type: Sequelize.BIGINT,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
        },
        startDate: {
          type: Sequelize.DATEONLY,
          field: "startDate",
          allowNull: false,
        },
        endDate: { type: Sequelize.DATEONLY, field: "endDate" },
        value: {
          type: Sequelize.DECIMAL(4, 2),
          field: "value",
          allowNull: false,
        },
        aporteId: {
          type: Sequelize.BIGINT,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull: true,
          field: "aporteId",
          references: { model: "aportes", key: "id" },
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "refreshTokens",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        token: { type: Sequelize.STRING, field: "token" },
        expiryDate: { type: Sequelize.DATE, field: "expiryDate" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users_roles",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        roleId: {
          type: Sequelize.INTEGER,
          field: "roleId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "roles", key: "id" },
          primaryKey: true,
        },
        userId: {
          type: Sequelize.BIGINT,
          field: "userId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "users", key: "id" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["app_configs", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["roles", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users_details", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users_settings", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["transactions", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["aportes", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["new_passwords", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["profits", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["refreshTokens", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users_roles", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
