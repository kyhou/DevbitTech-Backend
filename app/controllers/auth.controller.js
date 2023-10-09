const db = require("../models");
const config = require("../config/auth.config");
const Users = db.users;
const UsersDetails = db.usersDetails;
const UsersSettings = db.usersSettings;
const Roles = db.roles;
const NewPassword = db.newPassword;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
const argon2 = require('argon2');

exports.signup = (req, res) => {
    argon2.hash(req.body.password, { type: argon2.argon2id }).then((hash) => {
        Users.create({
            email: req.body.email.toLowerCase(),
            password: hash,
            active: true
        }).then(user => {
            UsersDetails.create({
                userId: user.id,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            });

            UsersSettings.create({
                userId: user.id,
                type: req.body.type,
            })

            if (req.body.roles) {
                Roles.findAll({
                    where: {
                        description: {
                            [Op.in]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        res.send({ message: "User was registered successfully!" });
                    });
                });
            } else {
                user.setRoles([1]).then(() => {
                    res.send({ message: "User was registered successfully!" });
                });
            }
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: err.message });
        });
    })
};

exports.signin = (req, res) => {
    Users.findOne({
        where: {
            email: req.body.email.toLowerCase()
        },
        include: [{
            model: UsersSettings,
            required: true,
        }]
    })
        .then(user => {
            if (!user.active) {
                return res.status(500).send({ message: "Falha de conexão com o servidor" });
            }

            if (!user) {
                return res.status(401).send({ message: "Email ou Senha inválidos!" });
            }

            argon2.verify(user.password, req.body.password, { type: argon2.argon2id }).then(async (passwordIsValid) => {
                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Email ou Senha inválidos!"
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: config.jwtExpiration
                });

                let refreshToken = await db.refreshToken.createToken(user);

                var authorities = [];
                user.getRoles().then(roles => {
                    for (let i = 0; i < roles.length; i++) {
                        authorities.push("ROLE_" + roles[i].description.toUpperCase());
                    }
                    res.status(200).send({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        roles: authorities,
                        accessToken: token,
                        type: user.users_setting.type,
                        refreshToken: refreshToken,
                    });
                });
            });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: err.message });
        });
};

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await db.refreshToken.findOne({
            where: {
                token: requestToken
            },
            include: [{
                model: db.users,
                required: true,
            }]
        });

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (db.refreshToken.verifyExpiration(refreshToken)) {
            db.refreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        const user = await refreshToken.user;
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.newPassword = (req, res) => {
    NewPassword.findOne({
        where: {
            key: req.body.data.key
        }
    }).then((result) => {
        userId = result.userId;

        argon2.hash(req.body.data.passwords.password, { type: argon2.argon2id }).then((hash) => {
            Users.findOne({
                where: {
                    id: userId
                }
            }).then((user) => {
                user.password = hash;
                user.save().then(() => {
                    result.destroy().then(() => {
                        res.send({ message: "Senha alterada com sucesso!" });
                    }).catch(() => { });
                }).catch((err) => {
                    req.log.error(err);
                    res.status(500).send({ message: "Falha ao alterar a senha." });
                })
            }).catch((err) => {
                req.log.error(err);
                res.status(500).send({ message: "Usuário não encontrado." });
            });
        });
    }).catch((err) => {
        req.log.error(err);
        res.status(500).send({ message: "Chave inválida." });
    });
};