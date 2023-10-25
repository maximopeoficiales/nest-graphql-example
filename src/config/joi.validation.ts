import * as Joi from 'joi';
import { ConfigEnv } from './interfaces/config.interface';

export const JoiValidationSchema = Joi.object<ConfigEnv>({
  STATE: Joi.optional(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().default('JWT_SECRET'),
  PORT: Joi.number().default(3000),
});
