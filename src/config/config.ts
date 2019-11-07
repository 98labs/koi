import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export enum LogLevel {
  error = 'error',
  warning = 'warning',
  info = 'info',
  debug = 'debug',
}

export interface ILoggingConfig {
  logDirectory: string;
  logLevel: LogLevel;
}

export interface IConfig {
  env: string;
  port: number;
  logging: ILoggingConfig;
  host: string;
  dbport: number;
  user: string;
  pass: string;
  database: string;
  dialect: string;
  jwtSecret: string;
  jwtValidity: string;
}

const logging: ILoggingConfig = {
  logDirectory: process.env.LOG_DIRECTORY,
  logLevel: LogLevel[process.env.LOG_LEVEL],
};

const config: IConfig = {
  logging,
  host: process.env.DB_HOST,
  dbport: +process.env.DB_PORT,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  database: process.env.DB_DATABASE_NAME,
  dialect: process.env.DB_DIALECT,
  env: process.env.ENV,
  port: +process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  jwtValidity: process.env.JWT_VALIDITY,
};

export { config };
