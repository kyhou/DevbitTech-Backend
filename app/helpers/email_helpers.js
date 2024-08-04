let nodemailer = require('nodemailer');
const pino = require('pino');
const fileTransport = pino.transport({
    target: 'pino/file',
    options: {
        destination: `${__dirname}/../../logs/email.log`,
        mkdir: true,
    },
});
const logger = pino(fileTransport);

const send = async (from, to, subject, html, text) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: `no-reply@${process.env.EMAIL_DOMAIN}`,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        let result = await transporter.sendMail(
            {
                from,
                to,
                subject,
                html,
                text,
            }
        );

        if (result) {
            return true;
        } else {
            logger.error("Email not sent");
            return false;
        }
    } catch (error) {
        logger.error("Error while sending email: " + error)
        return false
    }
}

exports.send = send;