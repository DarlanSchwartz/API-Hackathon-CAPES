
import { NextFunction, Request, Response } from "express";
import { isAxiosError } from "axios";
import { HttpStatus, ApplicationError } from "../protocols/error.types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(error: any, req: Request, res: Response, _next: NextFunction) {
    if (isAxiosError(error)) return res.status(error?.status ?? HttpStatus.INTERNAL_SERVER_ERROR).send(error?.response?.data);
    const ErrorBody = createErrorBody(error);
    if ("type" in error) {
        switch (error.type) {
            case "Conflict":
                return res.status(HttpStatus.CONFLICT).send(ErrorBody);
            case "NotFound":
                return res.status(HttpStatus.NOT_FOUND).send(ErrorBody);
            case "Unprocessable":
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(ErrorBody);
            case "Validation":
                return res.status(HttpStatus.BAD_REQUEST).send(ErrorBody);
            case "Unauthorized":
                return res.status(HttpStatus.UNAUTHORIZED).send(ErrorBody);
            case "Processing":
                return res.status(HttpStatus.NO_CONTENT).send(ErrorBody);
            case "Internal":
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
            case "Forbidden":
                return res.status(HttpStatus.FORBIDDEN).send(ErrorBody);
            case "Critical":
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
            case "BadRequest":
                return res.status(HttpStatus.BAD_REQUEST).send(ErrorBody);
            case "PaymentRequired":
                return res.status(HttpStatus.PAYMENT_REQUIRED).send(ErrorBody);
            case "Error":
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
            default:
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
        }
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ErrorBody);
}

function createErrorBody(error: ApplicationError | string) {
    if (typeof error === "string") return { message: error };
    return {
        message: error.message,
        type: error.type,
        fields: typeof error === "object" && error?.fields ? error.fields : undefined
    };
}