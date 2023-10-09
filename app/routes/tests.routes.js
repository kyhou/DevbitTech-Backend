module.exports = app => {
    const { authJwt } = require("../middleware");
    const users = require("../controllers/users.controller.js");
    var router = require("express").Router();

    router.get("/all", users.allAccess);

    router.get(
        "/user",
        [authJwt.verifyToken],
        users.userBoard
    );

    router.get(
        "/colab",
        [authJwt.verifyToken, authJwt.isColaborator],
        users.colaboratorBoard
    );

    router.get(
        "/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        users.adminBoard
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/test', router);

}