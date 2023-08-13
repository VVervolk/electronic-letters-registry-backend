const express = require("express");
const { schemaValidate, schemaEmptyObject } = require("../../schemas/contacts");

const { validateBody } = require("../../middlewares/index");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

router.get("/", ctrl.getAll);

router.get("/:contactId", ctrl.getById);

router.post(
  "/",
  validateBody(schemaEmptyObject),
  validateBody(schemaValidate),
  ctrl.add
);

router.delete("/:contactId", ctrl.deleteById);

router.put(
  "/:contactId",
  validateBody(schemaEmptyObject),
  validateBody(schemaValidate),
  ctrl.updateById
);

module.exports = router;
