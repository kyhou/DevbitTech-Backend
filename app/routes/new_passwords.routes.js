module.exports = function (app) {
    const newPasswordsController = require("../controllers/new_passwords.controller");

    var router = require("express").Router();

    router.get(
        "/findOne/:key",
        newPasswordsController.findOne
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.use('/api/new_passwords', router);
};