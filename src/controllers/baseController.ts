import { IObjectTransformable } from './../typings';

export class BaseController {

  protected transformer: IObjectTransformable;
  constructor(transformer: IObjectTransformable | any) {
    this.transformer = transformer;
  }

}
