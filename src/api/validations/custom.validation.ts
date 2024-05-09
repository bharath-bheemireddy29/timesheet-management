import { CustomHelpers, ErrorReport } from "joi";

/**
 * Validates if a value is a valid MongoDB ObjectId.
 * @param value - The string to validate.
 * @param helpers - Joi's helper object used to customize error messages.
 * @returns Either the value if valid or a Joi error report.
 */
export const objectId = (
  value: string,
  helpers: CustomHelpers
): string | ErrorReport => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.error("any.invalid", { value }); // Using custom error codes
  }
  return value;
};

/**
 * Validates if a value meets the password requirements.
 * @param value - The password to validate.
 * @param helpers - Joi's helper object used to customize error messages.
 * @returns Either the password if valid or a Joi error report.
 */
export const password = (
  value: string,
  helpers: CustomHelpers
): string | ErrorReport => {
  if (value.length < 8) {
    return helpers.error("string.min", { limit: 8 }); // Custom error code with parameters
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.error("password.complexity", { value }); // Custom error code
  }
  return value;
};
