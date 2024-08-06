import express from "express";
import { authJwt } from "../middleware/index.js";
import profits from "../controllers/profits.controller.js";

export default app => {
    let router = express.Router();

    router.get("/",
        [authJwt.verifyToken],
        profits.findAll
    );

    router.get("/:userId",
        [authJwt.verifyToken],
        profits.findAllUserProfits
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/profits', router);
};