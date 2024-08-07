import { authJwt } from "../middleware/index.js";
import users from "../controllers/users.controller.js";

export default function (router) {
    router.get("/test/all", users.allAccess);

    router.get(
        "/test/user",
        [authJwt.verifyToken],
        users.userBoard
    );

    router.get(
        "/test/colab",
        [authJwt.verifyToken, authJwt.isColaborator],
        users.colaboratorBoard
    );

    router.get(
        "/test/admin",
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

    return router;
}