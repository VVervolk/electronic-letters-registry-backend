const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Unit = require("./units");
const UsersType = require("./userstypes");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      // allowNull: false,
      primaryKey: true,
    },
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
      references: {
        model: Unit,
        key: "unitName",
      },
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

User.belongsTo(Unit, { foreignKey: "unitId", as: "unit" });
User.belongsTo(UsersType, { foreignKey: "userTypeId", as: "userType" });

sequelize.sync();

module.exports = User;
