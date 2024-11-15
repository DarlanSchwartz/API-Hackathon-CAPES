"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequiredError = exports.BadRequestError = exports.ForbiddenError = exports.CriticalError = exports.ProcessingError = exports.UnauthorizedError = exports.InternalError = exports.UnprocessableError = exports.NotFoundError = exports.ConflictError = exports.ValidationError = exports.CustomError = exports.HttpStatus = void 0;
class CustomError extends Error {
    constructor(message, fields) {
        super(message);
        this.type = "Error";
        this.code = -1;
        this.fields = fields;
        this.message = message;
        this.type = "Error";
    }
}
exports.CustomError = CustomError;
class PaymentRequiredError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "PaymentRequired";
    }
}
exports.PaymentRequiredError = PaymentRequiredError;
class ValidationError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Validation";
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Conflict";
    }
}
exports.ConflictError = ConflictError;
class NotFoundError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "NotFound";
    }
}
exports.NotFoundError = NotFoundError;
class UnprocessableError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Unprocessable";
    }
}
exports.UnprocessableError = UnprocessableError;
class InternalError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Internal";
    }
}
exports.InternalError = InternalError;
class UnauthorizedError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Unauthorized";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ProcessingError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Processing";
    }
}
exports.ProcessingError = ProcessingError;
class CriticalError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Critical";
    }
}
exports.CriticalError = CriticalError;
class ForbiddenError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "Forbidden";
    }
}
exports.ForbiddenError = ForbiddenError;
class BadRequestError extends CustomError {
    constructor(message, fields) {
        super(message, fields);
        this.type = "BadRequest";
    }
}
exports.BadRequestError = BadRequestError;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HttpStatus[HttpStatus["ACCEPTED"] = 202] = "ACCEPTED";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
