const Sequelize = require("sequelize");

const app = require("./app");

const { DB_HOST, USERNAME, DB_NAME, DB_PORT, PORT = 3000 } = process.env;

const sequelize = new Sequelize(DB_NAME, "root", "", {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
});

sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT);
    console.log("Connected.");
  })
  .catch((err) => console.error("Connection error: ", err));

module.exports = sequelize;
