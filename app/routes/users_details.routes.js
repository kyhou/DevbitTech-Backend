module.exports = app => {
    const users_details = require("../controllers/users_details.controller");
    const { authJwt } = require("../middleware");
    var router = require("express").Router();

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