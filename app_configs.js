/**
* Set enviroment variables from the table app_configs on the database
*/
module.exports = async () => {
    const pino = require('pino');

    const fileTransport = pino.transport({
        target: 'pino/file',
        options: {
            destination: `${__dirname}/logs/app_configs.log`,
            mkdir: true,
        },
    });
    /**
     * @typedef {import('pino').Logger} Logger
     * @type {Logger}
     */
    const logger = pino(fileTransport);

    const app_configs = require("./app/controllers/app_configs.controller");

    try {
        let configs = await app_configs.getAll();
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
}