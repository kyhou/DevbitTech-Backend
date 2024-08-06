import express from "express";
import { authJwt } from "../middleware/index.js";
import profits_page from "../controllers/profits_admin_page.controller.js";

export default app => {
    let router = express.Router();

    router.get("/",
        [authJwt.verifyToken, authJwt.isAdmin],
        profits_page.returnProfitsData
    );

    router.get("/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        profits_page.getProfitData
    );

    router.post(
        "/updateProfit",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        profits_page.updateProfit
    );

    router.post(
        "/newProfit",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        profits_page.newProfit
    );

    router.get(
        "/getUserAportes/:userId",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        profits_page.getUserAportes
    )

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use('/api/profitsAdminPage', router);
};