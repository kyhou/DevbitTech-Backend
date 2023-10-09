module.exports = app => {
    const users = require("../controllers/users.controller.js");

    var router = require("express").Router();

    // router.post("/", users.create); // new user

    router.get("/", users.findAll); // retrieve all users

    router.get("/:id", users.findOne); // retrieve single user by id

    router.put("/:id", users.update); // update user by id

    router.delete("/:id", users.delete); // delete user by id

    router.get("/getMessage/:userId", users.getMessage);

    router.put("/clearMessage/:userId", users.clearMessage);

    app.use('/api/users', router);
};