import * as Router from 'koa-router';
// import controller = require('./controller');

import { BaseContext } from 'koa';

// import different versions of the api
import { v1Router } from './v1';

const router = new Router();

// GENERAL ROUTES
router.get('/', async (ctx: BaseContext) => {
  ctx.body = 'Hello World';
});

const nestedRoutes: Router[] = [v1Router];
for (const xNestedRoute of nestedRoutes) {
  router.use(xNestedRoute.routes(), xNestedRoute.allowedMethods());
}

export { router };
