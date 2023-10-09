module.exports = app => {
    const userAporteDetails = require("../controllers/user_aporte_details.controller");
    const { authJwt } = require("../middleware");
    var router = require("express").Router();

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