import forgot_password from "../controllers/forgot_password.controller.js";

export default function (router) {
    router.post(
        "/api/forgot_password/send",
        forgot_password.send
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