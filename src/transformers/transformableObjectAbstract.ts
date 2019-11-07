import { Serializer, Error, JSONAPIError, JSONAPIErrorOptions } from 'jsonapi-serializer';

import { IObjectTransformable } from '../typings';
import * as Inflector from 'inflected';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export abstract class TransformableObjectAbstract implements IObjectTransformable  {

  protected serializer: Serializer;
  private isSerialize: boolean = false;

  protected abstract objectType: string;
  protected abstract visibleFields: string[];

  constructor() {
    this.isSerialize = process.env.JSON_API_STANDARD_COMPLIANT === 'true';
  }

  public getObjectType(pluralize: boolean = false): string {
    let objectType = this.objectType;
    if (pluralize) {
      objectType = Inflector.pluralize(this.objectType);
    }

    return objectType;
  }

  transform(subject: any, meta?: any) {

    let result = {};

    if (!this.isSerialize) {
      return subject.length > 1 ? subject.map((s) => {
        return this.setVisibleFields({}, s);
      }) : this.setVisibleFields({}, subject, true);
    }

    // if object is empty or {}, do not use any serializer and return just the meta
    if (subject && Object.keys(subject).length > 0) {
      this.serializer = new Serializer(this.objectType, {
        meta,
        attributes: this.visibleFields,
        keyForAttribute: 'camelCase',
      });

      result = this.serializer.serialize(subject);
    } else {
      if (meta && Object.keys(meta).length > 0) {
        result = { meta };
      }
    }

    return result;
  }

  transformError(errors: JSONAPIErrorOptions[]) {
    return new Error(errors);
  }

  private setVisibleFields(obj: object, s: any, single?: boolean) {
    single ? this.visibleFields.map((f) => { obj[f] = s[0][f]; })
           : this.visibleFields.map((f) => { obj[f] = s[f]; });
    return obj;
  }

}
