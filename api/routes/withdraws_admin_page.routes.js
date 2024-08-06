import { authJwt } from "../middleware/index.js";
import withdraws_page from "../controllers/withdraws_admin_page.controller.js";

export default function (router) {
    router.get("/api/withdrawsAdminPage/",
        [authJwt.verifyToken, authJwt.isAdmin],
        withdraws_page.returnWithdraws
    );

    router.post("/api/withdrawsAdminPage/toggleTransactionExecuted",
        [authJwt.verifyToken, authJwt.isAdmin],
        withdraws_page.toggleTransactionExecuted
    );

    router.post("/api/withdrawsAdminPage/toggleUserTransactionsExecuted",
        [authJwt.verifyToken, authJwt.isAdmin],
        withdraws_page.toggleUserTransactionsExecuted
    );
    
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    return router;
};