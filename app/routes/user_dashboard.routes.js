module.exports = app => {
    const { authJwt } = require("../middleware");
    const userDashboard = require("../controllers/user_dashboard.controller");
    var router = require("express").Router();

    router.get(
        "/:userId",
        [authJwt.verifyToken],
        userDashboard.getAportes);

    router.get(
        "/getAutoReinvest/:userId",
        [authJwt.verifyToken],
        userDashboard.getAutoReinvest);

    router.put(
        "/updateAutoReinvest/:userId",
        [authJwt.verifyToken],
        userDashboard.updateAutoReinvest);

    router.post(
        "/newTransaction/:userId",
        [authJwt.verifyToken],
        userDashboard.newTransaction);

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/user', router);
};