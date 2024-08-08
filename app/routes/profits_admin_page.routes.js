import { authJwt } from "../middleware/index.js";
import profits_page from "../controllers/profits_admin_page.controller.js";

export default function (router) {
    router.get("/api/profitsAdminPage/",
        [authJwt.verifyToken, authJwt.isAdmin],
        profits_page.returnProfitsData
    );

    router.get("/api/profitsAdminPage/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        profits_page.getProfitData
    );

    router.post(
        "/api/profitsAdminPage/updateProfit",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        profits_page.updateProfit
    );

    router.post(
        "/api/profitsAdminPage/newProfit",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        profits_page.newProfit
    );

    router.get(
        "/api/profitsAdminPage/getUserAportes/:userId",
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

    return router;
};