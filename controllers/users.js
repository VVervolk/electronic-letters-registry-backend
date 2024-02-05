const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const crypto = require("node:crypto");

const { User } = require("../models/users");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY } = process.env;

async function getAllUsers(req, res) {
  const users = await User.findAll();

  res.status(200).json(users);
}

async function addUser(req, res) {
  const { email: userEmail } = req.body;
  const user = await User.findOne({ where: { email: userEmail } });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const password = crypto.randomUUID().slice(0, 8);
  const hashPassword = await bcrypt.hash(password, 10);

  console.log(typeof hashPassword);

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
