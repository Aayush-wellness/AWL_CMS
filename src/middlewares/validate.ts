import type { RequestHandler } from "express";
import type { Schema } from "joi";
import { AppError } from "../utils/errors.js";

export function validateRequest(schema: Schema, property: "body" | "query" | "params" = "body"): RequestHandler {
  return (req, _res, next) => {
    const { value, error } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      next(new AppError("Validation failed", 400, error.details.map((detail) => detail.message)));
      return;
    }

    req[property] = value;
    next();
  };
}