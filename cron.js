module.exports = () => {
    const cron = require("./app/controllers/cron.controller");
    const CronJob = require('cron').CronJob;

    /**
     * Executa todo dia 1
     */
    const job1 = new CronJob('0 0 1 * *', function () {
        cron.processUsersProfits();
    });

    /**
     * Executa todo dia 6
     */
    const job2 = new CronJob('0 0 6 * *', function () {
        cron.processNewAportes();
    });

    job1.start();
    job2.start();
}