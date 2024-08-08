import { authJwt } from "../middleware/index.js";
import userStatement from "../controllers/user_statement.controller.js";

export default function (router) {
    router.get(
        "/api/user/statement/:userId", 
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
    
    return router;
};