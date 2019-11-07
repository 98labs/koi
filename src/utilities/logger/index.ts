import { logger } from './winstonLoggerInit';
import { WinstonLoggerUtility } from './winstonLoggerUtility';

const winstonLogger = new WinstonLoggerUtility(logger);

export { winstonLogger };
