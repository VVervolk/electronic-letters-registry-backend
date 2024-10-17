const { ctrlWrapper } = require("../helpers");
const Unit = require("../models/units");

async function getAllUnits(req, res) {
  const units = await Unit.findAll();

  res.status(200).json(units);
}

module.exports = {
  getAllUnits: ctrlWrapper(getAllUnits),
};
