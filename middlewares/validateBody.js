const { HttpError } = require("../helpers");

const validateBody = (schema) => {
  const func = (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      next(HttpError(400, `missing fields`));
      return func;
    }
    const { error } = schema.validate(req.body);

    if (error) {
      next(
        HttpError(
          400,
          `missing required ${error.message.slice(
            1,
            error.message.length - 13
          )} field`
        )
      );
    }
    next();
  };

  return func;
};

module.exports = validateBody;
