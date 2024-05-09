import Joi, { ObjectSchema, ValidationOptions } from 'joi';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { ApiError } from '../../utils/ApiError';

interface ValidationSchema {
  params?: ObjectSchema;
  query?: ObjectSchema;
  body?: ObjectSchema;
}

/**
 * Custom type guard to check if a key is one of the specified keys of the Request object
 */
function isRequestKey(key: any): key is 'params' | 'query' | 'body' {
  return ['params', 'query', 'body'].includes(key);
}

/**
 * Validate request data against schema
 * @param schema - Validation schema object containing Joi schemas
 * @returns Express middleware that validates the request
 */
const validate = (schema: ValidationSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validSchema: Partial<ValidationSchema> = {};
    ['params', 'query', 'body'].forEach((key) => {
      if (isRequestKey(key) && schema[key]) {
        validSchema[key] = schema[key];
      }
    });

    const object: any = {};
    ['params', 'query', 'body'].forEach((key) => {
      if (isRequestKey(key) && req[key]) {
        object[key] = req[key];
      }
    });

    const compiledSchema = Joi.compile(Joi.object(validSchema).unknown(true)) as ObjectSchema;
    const { value, error } = compiledSchema.validate(object, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ");
      next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      return;
    }

    Object.assign(req, value);
    next();
  };
};

export default validate;
