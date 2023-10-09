module.exports = app => {
    const forgot_password = require("../controllers/forgot_password.controller");
    var router = require("express").Router();

    router.post(
        "/send",
        forgot_password.send
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/forgot_password', router);
};