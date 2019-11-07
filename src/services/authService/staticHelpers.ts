import * as jwt from 'jsonwebtoken';
import * as jwtMiddleware from 'koa-jwt';

import { config } from './../../config/config';

import { User } from './../../models/core';

export const generateToken = (user: User): string => {

  const userData = {
    // id: user.id,
    // email: user.email,
  };

  const token = jwt.sign(
    userData,
    config.jwtSecret,
    {
      algorithm: 'HS512',
      expiresIn: config.jwtValidity,
    },
  );

  return token;

};

export const verifyTokenMiddleware = () => {
  return jwtMiddleware({ secret: config.jwtSecret });
};
