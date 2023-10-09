/**
 * @typedef {import('pino').Logger} Logger
 * @typedef {{key: string, value: string}} Configs
 */

const db = require("../models");
const AppConfigs = db.app_configs;
const op = db.Sequelize.Op;
const pino = require('pino');

const fileTransport = pino.transport({
    target: 'pino/file',
    options: {
        destination: `${__dirname}/../../logs/app_configs.log`,
        mkdir: true,
    },
});

/**
 * @type {Logger}
 */
const logger = pino(fileTransport);

/**
 * Returns all the key/value pairs of configurations.
 * @returns {Promise<Configs[]>}
 */
exports.getAll = async () => {
    var configs = await AppConfigs.findAll();

    if (configs) {
        logger.info("Configurations found");
        return configs;
    } else {
        logger.fatal("No coonfigurations found");
        return [];
    }
};

/**
 * Return the value associeted with a specific key.
 * @param {string} key Application configuration key.
 * @returns {Promise<string>} The value associeted with the configuration key.
 */
exports.getOne = async (key) => {
    var config = await Aportes.findByPk(key);

    if (config) {
        logger.info("Configuration key found");
        return config.value;
    } else {
        logger.error(`Cannot find configuration key=${key}.`);
        return "";
    }
};