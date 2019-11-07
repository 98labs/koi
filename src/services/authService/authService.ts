
import { User } from './../../models/core';

export class AuthService {

  constructor() {
  }

  public findUser(loginId: string): Promise<User> {
    const findUser = {
      where: {
        email: loginId,
        username: loginId,
      },
    };

    // return User.findOne(findUser);
    return;
  }

}
