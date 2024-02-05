const { DB_HOST, USERNAME, DB_NAME, DB_PORT, PORT = 3000 } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(DB_NAME, "root", "", {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
});

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
