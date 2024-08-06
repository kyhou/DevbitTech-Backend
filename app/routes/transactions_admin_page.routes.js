import express from "express";
import { authJwt } from "../middleware/index.js";
import transactions_page from "../controllers/transactions_admin_page.controller.js";

export default app => {
    let router = express.Router();

    router.get("/",
        [authJwt.verifyToken, authJwt.isAdmin],
        transactions_page.returnTransactionsData
    );

    router.get("/:transactionId",
        [authJwt.verifyToken, authJwt.isAdmin],
        transactions_page.getTransactionData
    );

    router.post(
        "/updateTransaction",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        transactions_page.updateTransaction
    );

    router.post(
        "/newTransaction",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        transactions_page.newTransaction
    );
    
    router.post(
        "/toggleTransactionActive",
        [
            
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        transactions_page.toggleTransactionExecuted
    );

    router.get(
        "/getUserAportes/:userId",
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
    app.use('/api/transactionsAdminPage', router);
};