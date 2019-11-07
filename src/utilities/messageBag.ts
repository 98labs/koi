import { IObjectTransformable } from './../typings';
import { TransformableObjectAbstract } from './../transformers';

export interface IMessageItem {
  message: string;
  context?: string;
}

export interface ICustomValidationError {
  status: number;
  message: string;
}

export enum STATUS {
  SUCCESS = 200,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  ERROR = 500,
}

export class MessageBag {

  protected _transformer: any;
  protected _status: number;
  protected _messages: IMessageItem[] = [];
  protected _data: any = {};
  protected _meta: any;

  constructor(transformer: IObjectTransformable) {
    this._transformer = transformer;
    this.setSuccess();
  }

  get status(): number {
    return this._status;
  }

  set status(newStatus: number) {
    // @TODO: check if this number is in the list
    this._status = newStatus;
  }

  get messages(): IMessageItem[] {
    return this._messages;
  }

  set messages(newMessages: IMessageItem[]) {
    this._messages = newMessages;
  }

  get data(): any {
    return this._data;
  }

  set data(newData: any) {
    this._data = newData;
  }

  get meta(): any {
    return this._meta;
  }

  set meta(newMeta: any) {
    this._meta = newMeta;
  }

  public setSuccess() {
    this._status = STATUS.SUCCESS;
  }

  public setNotFound() {
    this._status = STATUS.NOT_FOUND;
    this.addMessage({
      message: 'NOT FOUND',
    });
  }

  public setValidationError(errors: IMessageItem[]) {
    this._status = STATUS.VALIDATION_ERROR;
    this.messages = errors;
  }

  public setCustomValidationError(errors: ICustomValidationError) {
    this._status = errors.status;
    this.addMessage({
      message: errors.message,
    });
  }

  public setError() {
    this._status = STATUS.ERROR;
    this.addMessage({
      message: 'ERROR',
    });
  }

  public addMessage(message: IMessageItem) {
    this._messages.push(message);
  }

  protected prepareJsonError() {
    const jsonErrors = [];
    for (const xMessage of this.messages) {

      const localizedError = {
        status: this._status,
        detail: xMessage.message,
      };

      if (xMessage.context) {
        localizedError['source'] = {
          pointer: xMessage.context,
        };
      }

      jsonErrors.push(localizedError);
    }

    return jsonErrors;
  }

  public serialize(): any {
    let result: any = {};

    if (this._status === STATUS.SUCCESS) {
      result = this._transformer.transform(this._data, this._meta);
    } else {
      result = this._transformer.transformError(this.prepareJsonError());
    }

    return this._transformer.isSerialize ? result : {
      status: this._status,
      messages: this._messages,
      data: result,
      pagination: this._meta,
    };
  }

}
