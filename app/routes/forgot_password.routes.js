import express from "express";
import forgot_password from "../controllers/forgot_password.controller.js";

export default app => {
    let router = express.Router();

    router.post(
        "/send",
        forgot_password.send
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/forgot_password', router);
};