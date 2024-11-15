"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = errorHandler;
const axios_1 = require("axios");
const error_types_1 = require("../protocols/error.types");
function errorHandler(error, req, res, _next) {
    if ((0, axios_1.isAxiosError)(error))
        return res.status(error?.status ?? error_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send(error?.response?.data);
    const ErrorBody = createErrorBody(error);
    if ("type" in error) {
        switch (error.type) {
            case "Conflict":
                return res.status(error_types_1.HttpStatus.CONFLICT).send(ErrorBody);
            case "NotFound":
                return res.status(error_types_1.HttpStatus.NOT_FOUND).send(ErrorBody);
            case "Unprocessable":
                return res.status(error_types_1.HttpStatus.UNPROCESSABLE_ENTITY).send(ErrorBody);
            case "Validation":
                return res.status(error_types_1.HttpStatus.BAD_REQUEST).send(ErrorBody);
            case "Unauthorized":
                return res.status(error_types_1.HttpStatus.UNAUTHORIZED).send(ErrorBody);
            case "Processing":
                return res.status(error_types_1.HttpStatus.NO_CONTENT).send(ErrorBody);
            case "Internal":
                return res.status(error_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
            case "Forbidden":
                return res.status(error_types_1.HttpStatus.FORBIDDEN).send(ErrorBody);
            case "Critical":
                return res.status(error_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
            case "BadRequest":
                return res.status(error_types_1.HttpStatus.BAD_REQUEST).send(ErrorBody);
            case "PaymentRequired":
                return res.status(error_types_1.HttpStatus.PAYMENT_REQUIRED).send(ErrorBody);
            case "Error":
                return res.status(error_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
            default:
                return res.status(error_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
        }
    }
    return res.status(error_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
}
function createErrorBody(error) {
    if (typeof error === "string")
        return { message: error };
    return {
        message: error.message,
        type: error.type,
        fields: typeof error === "object" && error?.fields ? error.fields : undefined
    };
}
