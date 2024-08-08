import { authJwt } from "../middleware/index.js";
import transactions_page from "../controllers/transactions_admin_page.controller.js";

export default function (router) {
    router.get("/api/transactionsAdminPage/",
        [authJwt.verifyToken, authJwt.isAdmin],
        transactions_page.returnTransactionsData
    );

    router.get("/api/transactionsAdminPage/:transactionId",
        [authJwt.verifyToken, authJwt.isAdmin],
        transactions_page.getTransactionData
    );

    router.post(
        "/api/transactionsAdminPage/updateTransaction",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        transactions_page.updateTransaction
    );

    router.post(
        "/api/transactionsAdminPage/newTransaction",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        transactions_page.newTransaction
    );
    
    router.post(
        "/api/transactionsAdminPage/toggleTransactionActive",
        [
            
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        transactions_page.toggleTransactionExecuted
    );

    router.get(
        "/api/transactionsAdminPage/getUserAportes/:userId",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        transactions_page.getUserAportes
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