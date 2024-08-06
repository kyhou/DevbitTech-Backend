import users from "../controllers/users.controller.js";

export default function (router) {
    // router.post("/", users.create); // new user

    router.get("/api/users/", users.findAll); // retrieve all users

    router.get("/api/users/:id", users.findOne); // retrieve single user by id

    router.put("/api/users/:id", users.update); // update user by id

    router.delete("/api/users/:id", users.delete); // delete user by id

    router.get("/api/users/getMessage/:userId", users.getMessage);

    router.put("/api/users/clearMessage/:userId", users.clearMessage);

    return router;
};