import express from "express";
import { authJwt } from "../middleware/index.js";
import users_details from "../controllers/users_details.controller.js";

export default app => {
    let router = express.Router();

    router.get(
        "/id/:id", 
        [authJwt.verifyToken],
        users_details.findOne
    );
    
    router.get(
        "/name/:id", 
        [authJwt.verifyToken],
        users_details.findName
    );
    
    router.get(
        "/all", 
        [authJwt.verifyToken],
        users_details.findAll
    );
    
    app.use('/api/usersDetails', router);
};