import { Context } from 'koa';

import { ICustomAppContext } from './../../typings';
import { User } from './../../models/core';
import { BaseBreadController } from '../baseBreadController';
import { UserTransformer } from './../../transformers';
import { UserService } from './../../services/dbService';
import { ValidationService } from './../../services';

// type alias for shortcut to trigger intellisense
type CustomContext = Context & ICustomAppContext;

export class UserController extends BaseBreadController {

  constructor() {
    super(new UserTransformer(), new UserService, new ValidationService(User));

    // set any of these variables to false as needed

    // this.hasBrowse = false;
    // this.hasRead = true;
    // this.hasEdit = true;
    // this.hasAdd = true;
    // this.hasDelete = true;
  }

}
