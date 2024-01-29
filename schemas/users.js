const Joi = require("joi");

const seq = require("../server");
// const SUB_TYPE = ["starter", "pro", "business"];

const User = seq.define(
  "User",
  {
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
    },
    password: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    userTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

const schemaUser = Joi.object({
  password: Joi.string().required().min(6).messages({
    "any.required": "missing required password field",
    "string.min": "password length must be at least 6 characters long",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "missing required email field",
    "string.email": "invalid email",
  }),
  // subscription: Joi.string().valid(...SUB_TYPE),
});

// const schemaSub = Joi.object({
//   subscription: Joi.string()
//     .valid(...SUB_TYPE)
//     .messages({
//       "any.only": "wrong type of subscription",
//     }),
// });

const schemas = { schemaUser, schemaSub, schemaEmail };

module.exports = { schemas, User };
