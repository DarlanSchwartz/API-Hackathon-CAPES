class CustomError extends Error {
  fields?: object;
  type: ErrorType = "Error";
  message: string;
  code: number = -1;
  constructor(message: string, fields?: object) {
    super(message);
    this.fields = fields;
    this.message = message;
    this.type = "Error";
  }
}
class PaymentRequiredError extends CustomError {
  type: ErrorType = "PaymentRequired";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class ValidationError extends CustomError {
  type: ErrorType = "Validation";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class ConflictError extends CustomError {
  type: ErrorType = "Conflict";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class NotFoundError extends CustomError {
  type: ErrorType = "NotFound";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class UnprocessableError extends CustomError {
  type: ErrorType = "Unprocessable";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class InternalError extends CustomError {
  type: ErrorType = "Internal";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class UnauthorizedError extends CustomError {
  type: ErrorType = "Unauthorized";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class ProcessingError extends CustomError {
  type: ErrorType = "Processing";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class CriticalError extends CustomError {
  type: ErrorType = "Critical";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class ForbiddenError extends CustomError {
  type: ErrorType = "Forbidden";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

class BadRequestError extends CustomError {
  type: ErrorType = "BadRequest";
  constructor(message: string, fields?: object) {
    super(message, fields);
  }
}

type ErrorType = "Validation" |
  "Conflict" |
  "NotFound" |
  "Unprocessable" |
  "Internal" |
  "Unauthorized" |
  "Processing" |
  "Critical" |
  "Forbidden" |
  "BadRequest" |
  "PaymentRequired" |
  "Error";

type ApplicationError =
  ValidationError |
  ConflictError |
  NotFoundError |
  UnprocessableError |
  InternalError |
  UnauthorizedError |
  ProcessingError |
  CriticalError |
  ForbiddenError |
  PaymentRequiredError |
  BadRequestError;

enum HttpStatus {
  OK = 200,
  CREATED = 201,
  CONFLICT = 409,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NO_CONTENT = 204,
  PAYMENT_REQUIRED = 402,
  ACCEPTED = 202,
}

export {
  ErrorType,
  HttpStatus,
  ApplicationError,
  CustomError,
  ValidationError,
  ConflictError,
  NotFoundError,
  UnprocessableError,
  InternalError,
  UnauthorizedError,
  ProcessingError,
  CriticalError,
  ForbiddenError,
  BadRequestError,
  PaymentRequiredError
};

