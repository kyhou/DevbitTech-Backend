import { authJwt } from "../middleware/index.js";
import users_details from "../controllers/users_details.controller.js";

export default function (router) {
    router.get(
        "/usersDetails/id/:id", 
        [authJwt.verifyToken],
        users_details.findOne
    );
    
    router.get(
        "/usersDetails/name/:id", 
        [authJwt.verifyToken],
        users_details.findName
    );
    
    router.get(
        "/usersDetails/all", 
        [authJwt.verifyToken],
        users_details.findAll
    );
    
    return router;
};