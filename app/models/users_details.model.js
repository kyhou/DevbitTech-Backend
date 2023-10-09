module.exports = (sequelize, Sequelize) => {
  const UsersDetails = sequelize.define("users_details", {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    document: {
      type: Sequelize.STRING
    },
    documentType: {
      type: Sequelize.ENUM("CPF", "CNPJ")
    },
    phone: {
      type: Sequelize.STRING
    },
    maritalStatus: {
      type: Sequelize.ENUM("Casado(a)", "Solteiro(a)", "Viúvo(a)", "Divorciado(a)", "Separado(a)")
    },
    profession: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    number: {
      type: Sequelize.INTEGER
    },
    complement: {
      type: Sequelize.STRING
    },
    district: {
      type: Sequelize.STRING
    },
    zipCode: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    uf: {
      type: Sequelize.STRING
    }
  });

  return UsersDetails;
};