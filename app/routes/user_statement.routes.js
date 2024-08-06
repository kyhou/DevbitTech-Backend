import express from "express";
import { authJwt } from "../middleware/index.js";
import userStatement from "../controllers/user_statement.controller.js";

export default app => {
    let router = express.Router();

    router.get(
        "/:userId", 
        [authJwt.verifyToken],
        userStatement.findAll
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.use('/api/user/statement', router);
};