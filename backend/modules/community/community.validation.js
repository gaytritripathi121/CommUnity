import Joi from 'joi';

const communityValidation = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(10).required(),
  type: Joi.string().valid(
    'Cleanliness', 'Women Help', 'Food Rescue', 'Senior Citizen Support',
    'Mental Health', 'Disability Support', 'Legal Aid', 'Neighborhood Safety',
    'LGBTQ+ Support', 'Youth Empowerment', 'Clothes and Toys Donation',
    'Free Exchange', 'Literacy Support', 'First Aid'
  ).required()
});