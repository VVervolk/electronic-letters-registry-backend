const express = require("express");
const { schemas } = require("../../schemas/users");

const { validateBody, authenticate } = require("../../middlewares");

const router = express.Router();

const ctrl = require("../../controllers/auth");

router.post("/register", validateBody(schemas.schemaUser), ctrl.register);
router.post("/login", validateBody(schemas.schemaUser), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.post("/current", authenticate, ctrl.current);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.schemaSub),
  ctrl.subUpdate
);

module.exports = router;
