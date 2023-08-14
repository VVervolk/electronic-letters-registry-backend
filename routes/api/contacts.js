const express = require("express");
const { schemas } = require("../../schemas/contacts");

const { validateBody, isValidId } = require("../../middlewares");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

router.get("/", ctrl.getAll);

router.get("/:contactId", isValidId, ctrl.getById);

router.post(
  "/",
  validateBody(schemas.schemaEmptyObject),
  validateBody(schemas.schemaValidate),
  ctrl.add
);

router.delete("/:contactId", isValidId, ctrl.deleteById);

router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.schemaEmptyObject),
  validateBody(schemas.schemaValidate),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.schemaEmptyObject),
  validateBody(schemas.schemaFavourite),
  ctrl.updateStatusContact
);

module.exports = router;
