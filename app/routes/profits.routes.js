import { authJwt } from "../middleware/index.js";
import profits from "../controllers/profits.controller.js";

export default function (router) {
    router.get("/profits/",
        [authJwt.verifyToken],
        profits.findAll
    );

    router.get("/profits/:userId",
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

    return router;
};