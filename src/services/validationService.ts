import { BaseModel } from '../models/baseModel';
import * as validate from 'validate.js';

export class ValidationService {
  protected _model: BaseModel | any;

  constructor(model: BaseModel | any) {
    this._model = model;
  }

  private initValidationFormat() {
    validate.formatters.custom = function (errors) {
      return errors.map((error) => {
        return {
          context: error.attribute,
          message: error.error,
        };
      });
    };
  }

  public validate(data: any, format = 'custom') {
    const validationRules = this._model.getValidationRules();
    this.initValidationFormat();

    return validate(data, validationRules, { format });
  }
}
