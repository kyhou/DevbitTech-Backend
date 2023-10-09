module.exports = app => {
    const { authJwt } = require("../middleware");
    const withdraws_page = require("../controllers/withdraws_admin_page.controller");
    var router = require("express").Router();

    router.get("/",
        [authJwt.verifyToken, authJwt.isAdmin],
        withdraws_page.returnWithdraws
    );

    router.post("/toggleTransactionExecuted",
        [authJwt.verifyToken, authJwt.isAdmin],
        withdraws_page.toggleTransactionExecuted
    );

    router.post("/toggleUserTransactionsExecuted",
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
    app.use('/api/withdrawsAdminPage', router);
};