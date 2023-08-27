import { UserRole } from '@prisma/client';
import { celebrate, Joi } from 'celebrate';

export const UpdateProfileValidator = celebrate(
  {
    body: {
      firstname: Joi.string(),
      lastname: Joi.string(),
    },
  },
  { stripUnknown: true },
);

export const ChangeRoleValidator = celebrate(
  {
    body: {
      role: Joi.string().required().valid(UserRole.ADMIN, UserRole.USER),
    },
  },
  { stripUnknown: true },
);
