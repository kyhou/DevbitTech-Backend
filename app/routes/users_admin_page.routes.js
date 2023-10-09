module.exports = app => {
    const { authJwt } = require("../middleware");
    const users_page = require("../controllers/users_admin_page.controller");
    var router = require("express").Router();

    router.get("/",
        [authJwt.verifyToken, authJwt.isAdmin],
        users_page.returnUsersData
    );

    router.get("/:userId",
        [authJwt.verifyToken, authJwt.isAdmin],
        users_page.getUserData
    );
    
    router.post(
        "/updateUser",
        [
            authJwt.verifyToken, 
            authJwt.isAdmin
        ],
        users_page.updateUser
    );
    
    router.post(
        "/toggleUserActive",
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

    app.use('/api/usersAdminPage', router);
};