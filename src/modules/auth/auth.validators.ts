import { celebrate, Joi } from 'celebrate';

export const RegisterValidator = celebrate(
  {
    body: {
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().required().lowercase(),
      password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
    },
  },
  { stripUnknown: true },
);

export const LoginValidator = celebrate(
  {
    body: {
      email: Joi.string().required().lowercase(),
      password: Joi.string().required(),
    },
  },
  { stripUnknown: true },
);

export const SendOTPValidator = celebrate(
  {
    body: {
      email: Joi.string().required(),
    },
  },
  { stripUnknown: true },
);

export const ConfirmOTPValidator = celebrate(
  {
    body: {
      email: Joi.string().required().lowercase(),
      otp: Joi.string().required(),
    },
  },
  { stripUnknown: true },
);

export const ChangePasswordValidator = celebrate(
  {
    body: {
      email: Joi.string().required().lowercase(),
      otp: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required(),
    },
  },
  { stripUnknown: true },
);
