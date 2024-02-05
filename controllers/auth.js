const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const crypto = require("node:crypto");

const User = require("../models/users");
const Unit = require("../models/units");
const UsersType = require("../models/userstypes");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY } = process.env;

async function login(req, res) {
  const { password, email: userEmail } = req.body;
  const user = await User.findOne({
    where: { email: userEmail },
    include: [
      { model: Unit, as: "unit" },
      { model: UsersType, as: "userType" },
    ],
  });
  const passwordString = user.get("password").toString("utf8");

  //dataValues.unit.dataValues.unitName
  // console.log(user);

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, passwordString);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  const loginnedUser = await User.update(
    { token },
    {
      where: {
        id: user.id,
      },
    }
  );

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: userEmail,
      fullName: `${user.firstName} ${user.lastName}`,
      unit: user.unit.dataValues.unitName,
      userType: user.userType.dataValues.typeName,
    },
  });
}

async function logout(req, res) {
  const { id } = req.user;
  await User.update({ token: "" }, { where: { id } });
  res.status(204).send();
}

async function current(req, res) {
  const { id, firstName, lastName, email, unitId, userTypeId } = req.user;
  res.status(200).json({
    user: {
      id: id,
      email: email,
      fullName: `${firstName} ${lastName}`,
      unit: unitId,
      userType: userTypeId,
    },
  });
}

module.exports = {
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
};
