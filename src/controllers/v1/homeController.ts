import { Context } from 'koa';

import { ICustomAppContext } from './../../typings';

// type alias for shortcut to trigger intellisense
type CustomContext = Context & ICustomAppContext;

export class HomeController {

  constructor() { }

  public home = async(ctx: CustomContext) => {
    ctx.body = 'Hello World!';
  }

  public health = async(ctx: CustomContext) => {
    const healthStatus = {
      database: 'ok',
    };

    ctx.body = healthStatus;
  }

}
