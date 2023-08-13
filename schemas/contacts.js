const Joi = require("joi");

const schemaValidate = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]+(\s?[a-zA-Zа-яА-Я]+)*$/)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.number().integer().min(6).required(),
}).min(1);

const schemaEmptyObject = Joi.object().min(1);

module.exports = { schemaValidate, schemaEmptyObject };
