import { TransformableObjectAbstract } from './transformableObjectAbstract';
import { User } from './../models/core';

export class UserTransformer extends TransformableObjectAbstract {

  protected objectType = 'user';
  protected visibleFields = [
    'name',
  ];

}
