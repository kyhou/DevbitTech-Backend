import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";
const Users = db.users;
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

/**
 * Verifies the JWT token in the request headers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {void} If the token is missing or invalid, sends a 403 response with an error message. Otherwise, sets the user ID from the token in the request object and calls the next middleware function.
 */
let verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

let isAdmin = (req, res, next) => {
  Users.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (const role of roles) {
        if (role.description === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
    });
  });
};

let isColaborator = (req, res, next) => {
  Users.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (const role of roles) {
        if (role.description === "colab") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Colaborator Role!"
      });
    });
  });
};

let isColaboratorOrAdmin = (req, res, next) => {
  Users.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (const role of roles) {
        if (role.description === "colab" || role.description === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Colaborator or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isColaborator: isColaborator,
  isColaboratorOrAdmin: isColaboratorOrAdmin
};

export default authJwt;