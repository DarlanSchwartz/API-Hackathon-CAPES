"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateSchema;
const error_types_1 = require("../protocols/error.types");
function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body, { abortEarly: false });
        if (validation.error) {
            const errors = validation.error.details.map((detail) => detail.message);
            throw new error_types_1.UnprocessableError(errors.join(', '));
        }
        next();
    };
}
