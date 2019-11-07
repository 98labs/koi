import * as Router from 'koa-router';
// import controller = require('./controller');

import { BaseContext } from 'koa';
import { UserController } from '../../controllers/v1';

// authentication middleware
import { AuthService } from './../../services';
// const jwtMiddleware = AuthService.verifyTokenMiddleware();

const route = new Router({ prefix: '/user' });
const userCtrl = new UserController();

route.get('/', userCtrl.browse);
route.get('/:id', userCtrl.read);
route.patch('/:id', userCtrl.edit);
route.post('/', userCtrl.add);
route.delete('/:id', userCtrl.delete);

export { route as userRoute };
