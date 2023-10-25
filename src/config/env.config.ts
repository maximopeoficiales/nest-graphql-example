import { ConfigEnv } from './interfaces/config.interface';

export const EnvConfiguration = (): ConfigEnv => ({
  STATE: process.env.STATE || 'dev',
  DB_HOST: process.env.DB_HOST,
  DB_PORT: +process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: +process.env.PORT,
});
