import { authJwt } from "../middleware/index.js";
import userDashboard from "../controllers/user_dashboard.controller.js";

export default function (router) {
    router.get(
        "/user/:userId",
        [authJwt.verifyToken],
        userDashboard.getAportes);

    router.get(
        "/user/getAutoReinvest/:userId",
        [authJwt.verifyToken],
        userDashboard.getAutoReinvest);

    router.get(
        "/user/getBalanceOfType/:userId/:aporteType",
        [authJwt.verifyToken],
        userDashboard.getBalanceOfType);

    router.put(
        "/user/updateAutoReinvest/:userId",
        [authJwt.verifyToken],
        userDashboard.updateAutoReinvest);

    router.post(
        "/user/newTransaction/:userId",
        [authJwt.verifyToken],
        userDashboard.newTransaction);

    router.get(
        "/user/getUserProfits/:userId",
        [authJwt.verifyToken],
        userDashboard.getUserProfits
    );

    router.get(
        "/user/getAportesInitialSum/:userId",
        [authJwt.verifyToken],
        userDashboard.getAportesInitialSum
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