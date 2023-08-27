import { celebrate, Joi } from 'celebrate';

export const UploadFileValidator = celebrate(
  {
    body: {
      name: Joi.string().required(),
      folderId: Joi.string(),
      compress: Joi.boolean().default(false),
    },
  },
  { stripUnknown: true },
);

export const UpdateFileValidator = celebrate(
  {
    body: {
      name: Joi.string(),
      file: Joi.any(),
    },
  },
  { stripUnknown: true },
);
