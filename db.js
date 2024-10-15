require("dotenv").config();
const { Sequelize } = require("sequelize");

const { DB_HOST, USERNAME, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, "root", "", {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
});

module.exports = sequelize;
