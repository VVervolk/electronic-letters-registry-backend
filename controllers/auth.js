const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const crypto = require("node:crypto");

const { User } = require("../schemas/users");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

async function register(req, res) {
  const { password, email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = crypto.randomUUID();

  const { subscription } = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const emailData = {
    Recipients: [
      {
        Email: email,
        Fields: {
          name: email,
          verificationToken,
        },
      },
    ],
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content:
            "<div><p>Hi, {email}, please confirm your email by click on link below</p><a target='_blank' href='http://localhost:3000/users/verify/{verificationToken}'>Confirm</a></div>",
        },
      ],
      From: "nikita.volkov@meta.ua",
      Subject: "Email verification",
    },
  };

  await sendEmail(emailData);

  res.status(201).json({
    user: { email, subscription },
  });
}

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const emailData = {
    Recipients: [
      {
        Email: email,
        Fields: {
          name: email,
          verificationToken: user.verificationToken,
        },
      },
    ],
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content:
            "<div><p>Hi, {email}, please confirm your email by click on link below</p><a target='_blank' href='http://localhost:3000/users/verify/{verificationToken}'>Confirm</a></div>",
        },
      ],
      From: "nikita.volkov@meta.ua",
      Subject: "Email verification",
    },
  };

  await sendEmail(emailData);

  res.status(200).json({
    message: "Verification email sent",
  });
};

async function login(req, res) {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  console.log(Boolean(user.verificationToken));

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email aren`t verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  const { subscription } = await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email,
      subscription,
    },
  });
}

async function logout(req, res) {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
}

async function current(req, res) {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
}

async function subUpdate(req, res) {
  const { _id } = req.user;
  const { subscription: newSub } = req.body;
  const { email, subscription } = await User.findByIdAndUpdate(_id, {
    newSub,
  });
  res.status(200).json({ email, subscription });
}

async function avatarUpdate(req, res) {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  let normalizedAvatar;
  try {
    const image = await Jimp.read(tempUpload);
    normalizedAvatar = image.resize(250, 250).write(tempUpload);
  } catch (error) {
    console.log(error);
  }
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  console.log(avatarURL);

  res.status(200).json({
    avatarURL,
  });
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  current: ctrlWrapper(current),
  subUpdate: ctrlWrapper(subUpdate),
  avatarUpdate: ctrlWrapper(avatarUpdate),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
