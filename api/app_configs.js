import pino from 'pino';
import AppConfigs from "./controllers/app_configs.controller.js";

/**
* Set enviroment variables from the table app_configs on the database
*/
async function appConfigs() {
    /**
     * @typedef {import('pino').Logger} Logger
     * @type {Logger}
     */
    const logger = pino();

    try {
        let configs = await AppConfigs.getAll();
        if (configs) {
            for (let config of configs) {
                process.env[config.key] = config.value;
            }
            logger.info("Environment variables are all set :)");
        } else {
            throw new Error("Error reading app configs");
        }
    } catch (err) {
        throw err;
    }
};

export default appConfigs;
