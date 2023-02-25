import { Joi } from "express-validation";

const registerSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    avatar: Joi.string(),
    email: Joi.string().required(),
  }),
};

export default registerSchema;
