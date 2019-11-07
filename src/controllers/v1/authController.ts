import { Context } from 'koa';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { ICustomAppContext } from './../../typings';

import { MessageBag } from './../../utilities/messageBag';

import { BaseController } from './../baseController';

import { User } from './../../models/core';
import { UserTransformer } from './../../transformers';
import { generateToken, AuthService } from './../../services';

// type alias for shortcut to trigger intellisense
type CustomContext = Context & ICustomAppContext;

export class AuthController extends BaseController {

  private _authService: AuthService;
  constructor() {
    super(new UserTransformer());

    this._authService = new AuthService();
  }

  public login = async (ctx: CustomContext) => {

    const response = new MessageBag(new UserTransformer());

    const { loginId, password } = ctx.request.body;
    const user: User = await this._authService.findUser(loginId);

    if (user) {

      const hasCorrectPW = await bcrypt.compare(password, user.password);
      if (hasCorrectPW) {

        const userData = {
          user: this.transformer.transform(user),
          token: generateToken(user),
        };

        response.data = userData,
        response.setSuccess();
        response.addMessage({ message: 'Login Successful' });

      } else {
        response.setError();
        response.addMessage({ message: 'Login Failed: incorrect password' });
      }

    } else {
      response.setError();
      response.addMessage({ message: 'Login Failed: user does not exist' });
    }

    ctx.body = response.serialize();
    ctx.body = true;

  }

}
