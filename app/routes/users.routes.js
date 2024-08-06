import express from "express";
import users from "../controllers/users.controller.js";

export default app => {
    let router = express.Router();

    // router.post("/", users.create); // new user

    router.get("/", users.findAll); // retrieve all users

    router.get("/:id", users.findOne); // retrieve single user by id

    router.put("/:id", users.update); // update user by id

    router.delete("/:id", users.delete); // delete user by id

    router.get("/getMessage/:userId", users.getMessage);

    router.put("/clearMessage/:userId", users.clearMessage);

    app.use('/api/users', router);
};