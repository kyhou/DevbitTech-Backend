import newPasswordsController from "../controllers/new_passwords.controller.js";

export default function (router) {
    router.get(
        "/new_passwords/findOne/:key",
        newPasswordsController.findOne
    );

    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    return router;
};