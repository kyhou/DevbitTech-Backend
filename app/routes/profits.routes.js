module.exports = app => {
    const { authJwt } = require("../middleware");
    const profits = require("../controllers/profits.controller");
    var router = require("express").Router();

    router.get("/",
        [authJwt.verifyToken],
        profits.findAll
    );

    router.get("/:userId",
        [authJwt.verifyToken],
        profits.findAllUserProfits
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/profits', router);
};