import nodemailer from 'nodemailer';
import pino from 'pino';
const logger = pino();

const email_helpers = {};

email_helpers.send = async (from, to, subject, html, text) => {
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

export default email_helpers