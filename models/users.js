const { DB_HOST, USERNAME, DB_NAME, DB_PORT, PORT = 3000 } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const Unit = require("./units");
const UsersType = require("./userstypes");

const sequelize = new Sequelize(DB_NAME, "root", "", {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mariadb",
});

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
