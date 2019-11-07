/*
  It's ok to disable this rule here because we are not
  introducing complexity with template literals, treat them as regular strings!
*/
/* tslint:disable: max-line-length */

import * as winston from 'winston';
// tslint:disable-next-line: no-duplicate-imports
import { Logger, LoggerOptions, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import { config } from './../../config/config';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
const defaultLevel = config.logging.logLevel;

const options: LoggerOptions = {
  exitOnError: false,
  level: defaultLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.label(),
    // winston.format.splat(),
  ),
  transports: [
    new DailyRotateFile({
      filename: `%DATE%-info`,
      dirname: config.logging.logDirectory,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
    new DailyRotateFile({
      filename: `%DATE%-error`,
      dirname: config.logging.logDirectory,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
    new DailyRotateFile({
      filename: `%DATE%-silly`,
      dirname: config.logging.logDirectory,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '1d',
      level: 'silly',
    }),
  ],
};

const logger: Logger = winston.createLogger(options);

if (config.env === 'development' || config.env === 'local') {
  const consoleLogOptions: ConsoleTransportOptions = {
    format: winston.format.combine(
      winston.format.cli(),
      winston.format.printf((info) => {

        let template = `${info.timestamp} - [${info.label}] ${info.level}: ${info.message}`;

        if (info.stack) {
          template = `${info.timestamp} - [${info.label}] ${info.level}: ${info.message}\n ${info.stack} \n`;
        }

        if (info.meta) {
          const metaString = JSON.stringify(info.meta, undefined, 4);
          template = `${info.timestamp} - [${info.label}] ${info.level}: ${info.message} \n${metaString}\n`;
        }

        if (info.stack && info.meta) {
          const metaString = JSON.stringify(info.meta, undefined, 4);
          template = `${info.timestamp} - [${info.label}] ${info.level}: ${info.message} \n${info.stack} \n${metaString}\n`;
        }

        return template;
      }),
    ),
  };

  logger.add(new transports.Console(consoleLogOptions));
}

export { logger };
