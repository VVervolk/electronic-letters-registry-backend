const fs = require("fs/promises");
const path = require("path");

const HttpError = require("../helpers/HttpError");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const contactsAll = await fs.readFile(contactsPath);
  return JSON.parse(contactsAll);
};

const getContactById = async ({ contactId }) => {
  const contacts = await listContacts();
  const result = contacts.find(({ id }) => id === contactId);
  return result || null;
};

const removeContact = async ({ contactId }) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  const [result] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const obj = { id: String(Math.random() * 100), ...body };
  contacts.push(obj);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return obj;
};

const updateContact = async ({ contactId }, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
