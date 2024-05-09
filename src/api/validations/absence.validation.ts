import Joi from 'joi';

const createAbsence = {
    body: Joi.object().keys({
        user: Joi.string().required(),
        date: Joi.date().required(),
        reason: Joi.string().required(),
    }),
};

const updateAbsence = {
    body: Joi.object().keys({
        date: Joi.date(),
        reason: Joi.string(),
    }).min(1),
};

export { createAbsence, updateAbsence };
