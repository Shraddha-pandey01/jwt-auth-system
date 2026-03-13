const { z, ZodError } = require("zod");
const responseHelper = require("../helpers/responseHelper");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return responseHelper.handleError(
        res,
        { message: "validation error" },
        {
          errors: result.error.issues.map(e => ({
            field: e.path.join("."),
            message: e.message,
          })),
        }
      );
    }

    req.body = result.data;
    next();
  };
};

module.exports = {
  validate,
};