module.exports = app => {
    const userStatement = require("../controllers/user_statement.controller");
    const { authJwt } = require("../middleware");
    var router = require("express").Router();

    router.get(
        "/:userId", 
        [authJwt.verifyToken],
        userStatement.findAll
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    
    app.use('/api/user/statement', router);
};