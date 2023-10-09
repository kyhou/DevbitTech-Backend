const db = require("../models");
const Users = db.users;
const op = db.Sequelize.Op;

// exports.create = (req, res) => {
//   if (!req.body.title) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//     return;
//   }

//   const user = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     createdAt: Date.now()
//   };

//   Users.create(user)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the User."
//       });
//     });
// };

exports.findAll = (req, res) => {
  Users.findAll().then(data => {
    if (data) {
      res.send(data);
    } else {
      req.log.error("Nenhum usuário encotrado.");
      res.status(404).send({
        message: 'Cannot find Users.'
      });
    }
  }).catch(err => {
    req.log.error(err);
    res.status(500).send({
      message: "Error retrieving Users."
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Users.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Users with id=${id}.`
        });
      }
    })
    .catch(err => {
      req.log.error(err);      
      res.status(500).send({
        message: `Error retrieving Users with id=${id}`
      });
    });
};

exports.update = (req, res) => {
  res.send(req.body);
};

exports.delete = (req, res) => {

};

exports.deleteAll = (req, res) => {

};

exports.findByName = (req, res) => {

};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.colaboratorBoard = (req, res) => {
  res.status(200).send("Colaborator Content.");
};

exports.getMessage = (req, res) => {
  Users.findOne({
    where: {
      id: req.params.userId
    }
  }).then((user) => {
    res.status(200).send(user.message);
  }).catch((err) => {
    req.log.error(err);      
    res.status(500).send("Erro ao buscar a mensagem.");
  });
};

exports.clearMessage = (req, res) => {
  Users.findOne({
    where: {
      id: req.params.userId
    }
  }).then((user) => {
    user.message = "";
    user.save().then(() => {
      res.status(200).send("Mensagem removida com sucesso.");
    }).catch(() => {
      req.log.error("Erro ao limpar a mensagem.");      
      res.status(500).send("Erro ao limpar a mensagem.");
    })
  }).catch((err) => {
      req.log.error(err);      
    res.status(500).send("Erro ao buscar a mensagem para remover.");
  });
};