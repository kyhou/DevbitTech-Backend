const db = require("../models");
const Aportes = db.aportes;
const op = db.Sequelize.Op;
/**
 * @typedef {import('pino').Logger} Logger
 */

exports.findAll = (req, res) => {
    Aportes.findAll()
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: 'Cannot find Aportes.'
                });
            }
        })
        .catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: "Error retrieving Aportes."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Aportes.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Aportes with id=${id}.`
                });
            }
        })
        .catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: `Error retrieving Aportes with id=${id}`
            });
        });
};

exports.findAllByUser = (req, res) => {
    const userId = req.params.userId;

    Aportes.findAll({
        where: {
            userId: userId
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Aportes with id=${userId}.`
                });
            }
        })
        .catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: `Error retrieving Aportes with id=${userId}`
            });
        });
};

/**
 * 
 * @param {number} aporteId 
 * @param {string} contractId 
 * @param {Logger} logger
 */
exports.updateContractId = async (aporteId, contractId, logger) => {
    let aporte = await Aportes.findByPk(aporteId);
    if (aporte) {
        aporte.contractId = contractId;

        let result = await aporte.save()
        if (result) {
            logger.info(`Upload do contrato ${process.env.APORTE_PREFIX}${aporteId} realizado com sucesso`);
            return true;
        } else {
            console.error(`Erro ao alterar o id do arquivo do contrato para o Aporte ${aporteId}`);
            logger.error(err);
            return false;
        }
    } else {
        logger.error(`Aporte ${aporteId} não encontrado`);
        return false;
    }
}