import { ILogger } from '../../typings/index';

export class WinstonLoggerUtility implements ILogger {

  private logger: any;
  constructor(logger: any) {
    this.logger = logger;
  }

  get Logger(): any {
    return this.logger;
  }

  public info(message: string, label: string, meta: object = {}) {
    this.logger.info(message, {
      label,
      meta,
    });
  }

  public warning(message: string, label: string, meta: object = {}) {
    this.logger.warn(message, {
      label,
      meta,
    });
  }

  public error(message: string, label: string, meta: object = {}, stack: string = '') {
    this.logger.error(message, {
      label,
      meta,
      stack,
    });
  }

  public debug(message: string, label: string, meta: object = {}) {
    this.logger.debug(message, {
      label,
      meta,
    });
  }

}
