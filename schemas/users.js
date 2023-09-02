const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");

const Joi = require("joi");

const SUB_TYPE = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: SUB_TYPE,
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,

    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },

  { versionKey: false }
);

const User = model("user", userSchema);

userSchema.post("save", handleMongooseError);

const schemaUser = Joi.object({
  password: Joi.string().required().min(6).messages({
    "any.required": "missing required password field",
    "string.min": "password length must be at least 6 characters long",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
    "string.email": "invalid email",
  }),
  subscription: Joi.string().valid(...SUB_TYPE),
});

const schemaSub = Joi.object({
  subscription: Joi.string()
    .valid(...SUB_TYPE)
    .messages({
      "any.only": "wrong type of subscription",
    }),
});

const schemaEmail = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "missing required field email",
    "string.email": "invalid email",
  }),
});

const schemas = { schemaUser, schemaSub, schemaEmail };

module.exports = { schemas, User };
