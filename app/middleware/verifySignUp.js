import db from "../models/index.js";
const ROLES = db.ROLES;
const Users = db.users;

let checkDuplicateEmail = (req, res, next) => {
  // Email
  Users.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Email is already in use!"
      });
      return;
    }

    next();
  });
};

let checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (const role of req.body.roles) {
      if (!ROLES.includes(role)) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + role
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkRolesExisted: checkRolesExisted
};

export default verifySignUp;