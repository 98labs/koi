import * as Router from 'koa-router';

import { verifyTokenMiddleware } from './../../services';
import {
  HomeController,
  AuthController,
} from '../../controllers/v1';

// routes
import { userRoute } from './user';

const jwtMiddleware = verifyTokenMiddleware();
const v1Router = new Router({ prefix: '/v1' });

const homeCtrl = new HomeController();
v1Router.get('/', homeCtrl.home);
v1Router.get('/health', homeCtrl.health);

// authentication
const authCtrl = new AuthController();
v1Router.post('/auth/login', authCtrl.login);
v1Router.get('/auth/protected-url', jwtMiddleware, (ctx) => {
  ctx.body = ctx.state.user;
});

const nestedRoutes: Router[] = [
  userRoute,
];

for (const router of nestedRoutes) {
  v1Router.use(router.routes(), router.allowedMethods());
}

export { v1Router };
