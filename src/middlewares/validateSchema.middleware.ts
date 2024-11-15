import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { UnprocessableError } from "@/protocols/error.types";

export default function validateSchema(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      throw new UnprocessableError(errors.join(', '));
    }
    next();
  };
}