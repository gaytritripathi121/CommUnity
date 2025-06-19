import Joi from 'joi';

const foodValidation = Joi.object({
  description: Joi.string().required(),
  location: Joi.string().required(),
  availableUntil: Joi.date().required(),
  contactInfo: Joi.string().required()
});

export default foodValidation;
