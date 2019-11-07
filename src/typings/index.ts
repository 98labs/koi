import { JSONAPIErrorOptions } from 'jsonapi-serializer';

export interface ILogger {
  info(message: string, label: string, meta?: object): void;
  warning(message: string, label: string, meta?: object): void;
  error(message: string, label: string, meta?: object, stack?: string): void;
  debug(message: string, label: string, meta?: object): void;
}

export interface ICustomAppContext {
  logger?: ILogger;
}

export interface ICustomAppState {

}

export interface IObjectTransformableError {
  code: string;
}

export interface IObjectTransformable {
  getObjectType(pluralize: boolean): string;
  transform(subject: any | [], meta?: any): any;
  transformError(errors: JSONAPIErrorOptions[]);
}

export enum SORT_DIRECTION {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum PartyTypes {
  MEMBER = 'MEMBER',
  USER = 'USER',
}

export interface IJsonAPIQuery {
  page?: {
    number?: number,
    size?: number,
    count?: number,
  };
  sort?: {
    field: string,
    direction: SORT_DIRECTION,
  };
  filters?: Object | string;
}
