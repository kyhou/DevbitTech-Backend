import { authJwt } from "../middleware/index.js";
import aportes_page from "../controllers/aportes_admin_page.controller.js";



export default function (router) {
    router.get("/aportesAdminPage/",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        aportes_page.returnAportesData
    );

    router.post(
        "/aportesAdminPage/updateAporte",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        aportes_page.updateAporte
    );

    router.post(
        "/aportesAdminPage/newAporte",
        [
            authJwt.verifyToken,
            authJwt.isAdmin
        ],
        aportes_page.newAporte
    );

    router.post(
        "/aportesAdminPage/generateContract",
        [
            authJwt.verifyToken,
            authJwt.isAdmin,
        ],
        aportes_page.generateContract
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