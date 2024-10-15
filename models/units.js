const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Unit = sequelize.define(
  "Unit",
  {
    unitName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

sequelize.sync();

module.exports = Unit;
