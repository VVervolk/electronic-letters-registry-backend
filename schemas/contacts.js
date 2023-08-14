const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../middlewares");

const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contact = model("contact", contactSchema);

contactSchema.post("save", handleMongooseError);

const schemaValidate = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Zа-яА-Я]+(\s?[a-zA-Zа-яА-Я]+)*$/)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.number().integer().min(6).required(),
  favorite: Joi.boolean(),
}).min(1);

const schemaFavourite = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemaEmptyObject = Joi.object().min(1);

const schemas = { schemaValidate, schemaEmptyObject, schemaFavourite };

module.exports = { schemas, Contact };
