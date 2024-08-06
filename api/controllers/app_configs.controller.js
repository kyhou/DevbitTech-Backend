/**
 * @typedef {import('pino').Logger} Logger
 * @typedef {{key: string, value: string}} Configs
 */

import db from "../models/index.js";
import pino from 'pino';

const app_configs = db.app_configs;
const AppConfigs = {};

/**
 * @type {Logger}
 */
const logger = pino();

/**
 * Returns all the key/value pairs of configurations.
 * @returns {Promise<Configs[]>}
 */
AppConfigs.getAll = async () => {
    let configs = await app_configs.findAll();

    if (configs) {
        logger.info("Configurations found");
        return configs;
    } else {
        logger.fatal("No configurations found");
        return [];
    }
};

/**
 * Return the value associated with a specific key.
 * @param {string} key Application configuration key.
 * @returns {Promise<string>} The value associated with the configuration key.
 */
AppConfigs.getOne = async (key) => {
    let config = await app_configs.findByPk(key);

    if (config) {
        logger.info("Configuration key found");
        return config.value;
    } else {
        logger.error(`Cannot find configuration key=${key}.`);
        return "";
    }
};

export default AppConfigs;