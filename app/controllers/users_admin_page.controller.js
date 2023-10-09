const db = require("../models");
const Users = db.users;
const UsersDetails = db.usersDetails;
const UsersSettings = db.usersSettings;
const Roles = db.roles;
const Op = db.Sequelize.Op;
const argon2 = require('argon2');

exports.returnUsersData = (req, res) => {
    const rows = [];

    Users.findAll({
        include: [
            {
                model: UsersDetails,
                required: false,
            },
            {
                model: UsersSettings,
                required: false,
            },
            {
                model: Roles,
                required: false,
            }
        ]
    }).
        then((users) => {
            users.forEach((user) => {
                try {
                    if (user) {
                        var row = {
                            id: user.id,
                            email: user.email,
                            active: user.active ? "Ativo" : "Inativo",
                            fullName: `${user.users_detail.firstName} ${user.users_detail.lastName}`,
                            roles: ""
                        };

                        var rolesDesc = [];
                        user.roles.forEach((role) => {
                            rolesDesc.push(role.description);
                        })

                        row.roles = rolesDesc.join(' - ');

                        if (user.users_setting) {
                            row.type = user.users_setting.type;
                        }

                        rows.push(row);
                    } else {
                        req.log.error("Nenhum usuário encontrado.");
                        res.status(404).send({
                            message: "Nenhum usuário encontrado."
                        });
                    }
                } catch (e) {
                    throw e;
                }
            });

            res.send(rows);
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({
                message: 'Error retrieving Users'
            });
        });

};

exports.getUserData = (req, res) => {
    Users.findByPk(req.params.userId).then((user) => {
        res.status(200).send({ user });
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({ message: "Usuário não encontrado" });
    });
};

exports.updateUser = (req, res) => {
    if (req.body.user.password) {
        argon2.hash(req.body.user.password, { type: argon2.argon2id }).then((hash) => {
            Users.update(
                {
                    password: hash
                },
                {
                    where:
                    {
                        id: req.body.user.id
                    }
                }).then().catch(err => {
                    req.log.error(err);
                    res.status(500).send("Erro ao alterar a senha.");
                });
        });
    }

    // Roles.destroy()
    Users.findOne({
        where: {
            id: req.body.user.id
        },
        include: [
            {
                model: UsersDetails,
                required: false,
            },
            {
                model: UsersSettings,
                required: false,
            },
            {
                model: Roles,
                required: false,
            }
        ]
    }).then((user) => {
        user.roles = [];
        user.save().then().catch((err) => {
            req.log.error(err);
            res.status(500).send({ message: "Erro ao excluir as permissões do usuário." });
        });

        if (req.body.user.roles) {
            Roles.findAll({
                where: {
                    description: {
                        [Op.in]: req.body.user.roles
                    }
                }
            }).then(roles => {
                user.setRoles(roles).then(() => { }).catch(err => {
                    req.log.error(err);
                    res.status(500).send({ message: "Erro ao recriar as permissões do usuário." });
                });
            });
        }

        user.email = req.body.user.email;

        user.users_detail.firstName = req.body.user.firstName.trim();
        user.users_detail.lastName = req.body.user.lastName.trim();
        user.users_detail.save().catch({ message: 'Erro ao alterar UsersDetail' });

        user.users_setting.type = req.body.user.type.trim();
        user.users_setting.save().catch({ message: 'Erro ao alterar UsersSettings' });

        user.save().then(() => {
            res.send({ message: "Usuário alterado com sucesso." });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: "Erro ao alterar o usuário." });
        });
    }).catch(err => {
        req.log.error(err);
        res.status(500).send({ message: "Usuário não encontrado." });
    });
}

exports.toggleUserActive = (req, res) => {
    Users.findByPk(req.body.userId).then((user) => {
        user.active = !user.active;
        user.save().then(() => {
            res.status(200).send({ message: `Usuário ${user.active ? "ativado" : "desativado"} com sucesso!` });
        }).catch(err => {
            req.log.error(err);
            res.status(500).send({ message: `Erro ao ${user.active ? "ativar" : "desativar"} o usuário!` });
        });
    });
}