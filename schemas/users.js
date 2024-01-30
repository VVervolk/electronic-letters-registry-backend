const { DB_HOST, USERNAME, DB_NAME, DB_PORT, PORT = 3000 } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(DB_NAME, "root", "", {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
});

const User = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { isNumeric: true },
    },
    userTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: { isNumeric: true },
    },
    token: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false }
);

sequelize.sync();

module.exports = { User };
