import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../protocols/error.types";
import { z } from "zod";
import { ParamSchema, QuerySchema, ExtendedHandler, ValidTypes } from "../protocols/middlewares.types";
const defaultMessage = (param: string, type: string, receivedValue?: string) => {
  return {
    message: `Invalid query parameter value for ${param}`,
    expected: type,
    received: receivedValue,
  };
};

export default function validateRequest(bodySchema?: z.Schema | null, paramsSchema?: ParamSchema | null, querySchema?: QuerySchema | null, parseBodyData: boolean = false): ExtendedHandler {
  const validateSchema: ExtendedHandler = (req: Request, res: Response, next: NextFunction) => {
    let body = req.body;
    if (parseBodyData) {
      try {
        if (typeof req.body.data === "string") {
          const data = JSON.parse(body.data);
          req.body = data;
          body = data;
        }
      }
      catch (err) {
        throw new ValidationError("Invalid request body", err as object);
      }
    }

    if (bodySchema) {
      const { success, error, data } = bodySchema.safeParse(body);
      if (!success) {
        throw new ValidationError("Body validation failed", error);
      }
      /**
       *  Zod iterates over the union schemas until it finds one that parses successfully. If multiple schemas pass validation, Zod has no way of picking which schema is "more correct" in the general case.
       */
      if (bodySchema instanceof z.ZodUnion === false) {
        // Assign the body with the parsed and transformed data
        req.body = data;
      }
    }

    if (paramsSchema) {
      for (const param in paramsSchema) {
        const expectedType = paramsSchema[param];
        const paramValue = req.params[param];
        if (!isValidQueryParamValue(paramValue, expectedType)) {
          const message = defaultMessage(param, expectedType, paramValue);
          throw new ValidationError("Missing parameter(s)", message);
        }
      }
    }
    if (querySchema) {
      for (const param in querySchema) {
        const expectedType = querySchema[param];
        const paramValue = req.query[param];
        if (paramValue === undefined || paramValue === "" || !paramValue) {
          delete req.query[param];
          continue;
        }
        if (Array.isArray(paramValue)) {
          const message = defaultMessage(param, expectedType, paramValue.toString());
          throw new ValidationError("Query params error", message);
        }
        if (!isValidQueryParamValue(paramValue?.toString(), expectedType)) {
          const message = defaultMessage(param, expectedType, paramValue?.toString());
          throw new ValidationError("Query params error", message);
        }
      }
    }
    next();
  };

  validateSchema.bodySchema = bodySchema;
  validateSchema.paramsSchema = paramsSchema;
  validateSchema.querySchema = querySchema;
  return validateSchema;
}

function isValidQueryParamValue(value?: string, type?: ValidTypes): boolean {
  if (value === undefined) return true;
  if (value.length === 0) return false;
  if (value.trim().length === 0) return false;
  if (!type) return false;
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return !isNaN(Number(value));
    case "boolean":
      return value === "true" || value === "false";
    default:
      return false;
  }
}