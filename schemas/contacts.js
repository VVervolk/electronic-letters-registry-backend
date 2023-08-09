const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]+(\s?[a-zA-Zа-яА-Я]+)*$/)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.number().integer().min(6).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().pattern(/^[a-zA-Zа-яА-Я]+(\s?[a-zA-Zа-яА-Я]+)*$/),
  email: Joi.string().email(),
  phone: Joi.number().integer().min(6),
}).min(1);

module.exports = { addSchema, updateSchema };
