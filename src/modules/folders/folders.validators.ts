import { celebrate, Joi } from 'celebrate';

export const NewFolderValidator = celebrate(
  {
    body: {
      name: Joi.string().required(),
    },
  },
  { stripUnknown: true },
);

export const UpdateFolderValidator = celebrate(
  {
    body: {
      name: Joi.string(),
    },
  },
  { stripUnknown: true },
);
