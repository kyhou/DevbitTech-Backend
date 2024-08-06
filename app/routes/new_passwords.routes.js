import express from "express";
import newPasswordsController from "../controllers/new_passwords.controller.js";

export default function (app) {

    let router = express.Router();

    router.get(
        "/findOne/:key",
        newPasswordsController.findOne
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/new_passwords', router);
};