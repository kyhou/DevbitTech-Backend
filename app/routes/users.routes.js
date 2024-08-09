import users from "../controllers/users.controller.js";

export default function (router) {
    // router.post("/", users.create); // new user

    router.get("/users/", users.findAll); // retrieve all users

    router.get("/users/:id", users.findOne); // retrieve single user by id

    router.put("/users/:id", users.update); // update user by id

    router.delete("/users/:id", users.delete); // delete user by id

    router.get("/users/getMessage/:userId", users.getMessage);

    router.put("/users/clearMessage/:userId", users.clearMessage);

    return router;
};