const { Contact } = require("../schemas/contacts");

const { HttpError, ctrlWrapper } = require("../helpers");

async function getAll(req, res) {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite = null } = req.query;
  const skip = (page - 1) * limit;
  let contactsAll = [];
  if (favorite !== null) {
    contactsAll = await Contact.find({ owner, favorite }, {}, { skip, limit });
  } else {
    contactsAll = await Contact.find({ owner }, {}, { skip, limit });
  }
  res.status(200).json(contactsAll);
}

async function getByID(req, res) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
}

async function addContact(req, res) {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
}

async function deleteContact(req, res) {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
}

async function updateContact(req, res) {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
}

async function updateStatusContact(req, res) {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(contact);
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getByID),
  add: ctrlWrapper(addContact),
  deleteById: ctrlWrapper(deleteContact),
  updateById: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
