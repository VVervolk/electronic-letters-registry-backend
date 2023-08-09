const contacts = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");
const { addSchema, updateSchema } = require("../schemas/contacts");

async function getAll(req, res) {
  const contactsAll = await contacts.listContacts();
  res.status(200).json(contactsAll);
}

async function getByID(req, res) {
  const contactId = await contacts.getContactById(req.params);
  if (!contactId) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contactId);
}

async function addContact(req, res) {
  const { error } = addSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
}

async function deleteContact(req, res) {
  const contactId = await contacts.removeContact(req.params);
  if (!contactId) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
}

async function updateContact(req, res) {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const updatedContact = await contacts.updateContact(req.params, req.body);
  if (!updatedContact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(updatedContact);
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getByID),
  add: ctrlWrapper(addContact),
  deleteById: ctrlWrapper(deleteContact),
  updateById: ctrlWrapper(updateContact),
};
