const express = require("express");
const { schemas } = require("../../schemas/contacts");

const { validateBody, isValidId, authenticate } = require("../../middlewares");

const router = express.Router();

const ctrl = require("../../controllers/contacts");

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.schemaEmptyObject),
  validateBody(schemas.schemaValidate),
  ctrl.add
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.schemaEmptyObject),
  validateBody(schemas.schemaValidate),
  ctrl.updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.schemaFavourite),
  ctrl.updateStatusContact
);

module.exports = router;
