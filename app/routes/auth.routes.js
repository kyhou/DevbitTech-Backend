import { authJwt, verifySignUp } from "../middleware/index.js";
import authController from "../controllers/auth.controller.js";
import express from "express";

export default app => {
    let router = express.Router();

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post(
        "/signup",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin,
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );

    router.post("/refreshtoken", authController.refreshToken);
    router.post("/signin", authController.signin);
    router.post("/newPassword", authController.newPassword);

    app.use('/api/auth', router);
};