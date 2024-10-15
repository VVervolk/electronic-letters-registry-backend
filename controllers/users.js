const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const crypto = require("node:crypto");

const sequelize = require("../db");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const User = require("../models/users");

const Unit = require("../models/units");
const UsersType = require("../models/userstypes");

const { SECRET_KEY } = process.env;

async function getAllUsers(req, res) {
  const data = await User.findAll({
    attributes: ["id", "firstName", "lastName", "email"],
    include: [
      {
        model: Unit,
        as: "unit",
      },
      {
        model: UsersType,
        as: "userType",
      },
    ],
  });

  const usersFromDB = JSON.stringify(data, null, 2);
  const usersNormalType = JSON.parse(usersFromDB);
  const users = usersNormalType.map((user) => {
    user.unit = user.unit.unitName;
    user.userType = user.userType.typeName;
    return user;
  });

  res.status(200).json(users);
}

async function addUser(req, res) {
  const { email: userEmail } = req.body;
  const user = await User.findOne({ where: { email: userEmail } });
  console.log(user);

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const password = crypto.randomUUID().slice(0, 8);
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    email: userEmail,
    password: password,
  });
}

async function deleteUser(req, res) {
  const { userId } = req.params;
  const user = await User.destroy({ where: { id: userId } });

  if (!user) {
    throw HttpError(400, "Bad Request");
  }

  res.status(200).json({
    message: "User deleted",
  });
}

module.exports = {
  getAllUsers: ctrlWrapper(getAllUsers),
  addUser: ctrlWrapper(addUser),
  deleteUser: ctrlWrapper(deleteUser),
};
