const express = require("express");
const { schemas } = require("../../schemas/users");

const { validateBody, authenticate, upload } = require("../../middlewares");

const router = express.Router();

const ctrl = require("../../controllers/auth");

router.post("/register", validateBody(schemas.schemaUser), ctrl.register);
router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.schemaEmail),
  ctrl.resendVerifyEmail
);
router.post("/login", validateBody(schemas.schemaUser), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.current);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.schemaSub),
  ctrl.subUpdate
);
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.avatarUpdate
);

module.exports = router;
