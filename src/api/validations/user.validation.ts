import Joi from 'joi';
import { password, objectId } from './custom.validation';

interface ValidationSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

const createUser: ValidationSchema = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password, 'custom password validation'),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers: ValidationSchema = {
  query: Joi.object({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser: ValidationSchema = {
  params: Joi.object({
    userId: Joi.string().custom(objectId, 'custom objectId validation'),
  }),
};

const updateUser: ValidationSchema = {
  params: Joi.object({
    userId: Joi.string().required().custom(objectId, 'custom objectId validation'),
  }),
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().custom(password, 'custom password validation'),
    name: Joi.string(),
  }).min(1),
};

const deleteUser: ValidationSchema = {
  params: Joi.object({
    userId: Joi.string().custom(objectId, 'custom objectId validation'),
  }),
};

export {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
