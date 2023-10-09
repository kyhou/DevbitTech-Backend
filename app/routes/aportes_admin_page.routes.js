module.exports = app => {
    const { authJwt } = require("../middleware");
    const aportes_page = require("../controllers/aportes_admin_page.controller");
    var router = require("express").Router();

    router.get("/",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        aportes_page.returnAportesData
    );

    router.post(
        "/updateAporte",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        aportes_page.updateAporte
    );

    router.post(
        "/newAporte",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        aportes_page.newAporte
    );

    router.post(
        "/generateContract",
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
        ],
        aportes_page.generateContract
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/aportesAdminPage', router);
};