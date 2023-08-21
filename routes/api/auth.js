const express = require("express");
const { schemaUser } = require("../../schemas/users");

const { validateBody, authenticate } = require("../../middlewares");

const router = express.Router();

const ctrl = require("../../controllers/auth");

router.post("/register", validateBody(schemaUser), ctrl.register);
router.post("/login", validateBody(schemaUser), ctrl.login);
// router.post("/current", authenticate);

module.exports = router;
