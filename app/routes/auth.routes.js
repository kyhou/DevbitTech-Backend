import { authJwt, verifySignUp } from "../middleware/index.js";
import authController from "../controllers/auth.controller.js";

export default function (router) {
    router.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    router.post(
        "/api/auth/signup",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin,
            verifySignUp.checkDuplicateEmail,
            verifySignUp.checkRolesExisted
        ],
        authController.signup
    );

    router.post("/api/auth/refreshtoken", authController.refreshToken);
    router.post("/api/auth/signin", authController.signin);
    router.post("/api/auth/newPassword", authController.newPassword);

    return router;
};