import { authJwt } from "../middleware/index.js";
import users_page from "../controllers/users_admin_page.controller.js";

export default function (router) {
    router.get("/usersAdminPage/",
        [authJwt.verifyToken, authJwt.isAdmin],
        users_page.returnUsersData
    );

    router.get("/usersAdminPage/:userId",
        [authJwt.verifyToken, authJwt.isAdmin],
        users_page.getUserData
    );
    
    router.post(
        "/usersAdminPage/updateUser",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        users_page.updateUser
    );
    
    router.post(
        "/usersAdminPage/toggleUserActive",
        [
            
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        users_page.toggleUserActive
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