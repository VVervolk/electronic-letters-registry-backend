const express = require("express");

const { authenticate, upload } = require("../middlewares");

const router = express.Router();

const ctrl = require("../controllers/auth");

router.post("/login", ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.current);
// router.patch(
//   "/",
//   authenticate,
//   validateBody(schemas.schemaSub),
//   ctrl.subUpdate
// );

module.exports = router;
