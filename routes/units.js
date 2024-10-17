const express = require("express");

const router = express.Router();

const ctrl = require("../controllers/units");

router.get("/", ctrl.getAllUnits);

module.exports = router;
