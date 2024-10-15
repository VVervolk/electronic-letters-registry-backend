const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const UsersType = sequelize.define(
  "UsersType",
  {
    typeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

sequelize.sync();

module.exports = UsersType;
