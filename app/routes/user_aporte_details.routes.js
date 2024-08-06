import express from "express";
import { authJwt } from "../middleware/index.js";
import userAporteDetails from "../controllers/user_aporte_details.controller.js";

export default app => {
    let router = express.Router();

    router.get(
        "/:aporteId",
        [authJwt.verifyToken],
        userAporteDetails.findAll
        );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/user/aporteDetails', router);
};