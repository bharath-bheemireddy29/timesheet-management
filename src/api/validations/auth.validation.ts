import Joi from "joi";
import { password as passwordValidator } from "./custom.validation"; // Assuming password is a function exported from custom.validation

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

const register: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string()
      .required()
      .custom(passwordValidator, "custom password validation"),
    name: Joi.string().required(),
  }),
};

const login: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const logout: ValidationSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens: ValidationSchema = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword: ValidationSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
};

const resetPassword: ValidationSchema = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .custom(passwordValidator, "custom password validation"),
  }),
};

const verifyEmail: ValidationSchema = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
