require("dotenv").config();
const sequelize = require("./db");

const app = require("./app");

const { PORT = 8888 } = process.env;

sequelize
  .authenticate()
  .then(() => {
    app.listen(PORT);
    console.log(`Connected with port ${PORT}`);
  })
  .catch((err) => console.error("Connection error: ", err));
