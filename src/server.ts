import * as Koa from 'koa';
// import * as jwt from 'koa-jwt';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';

import {
  ICustomAppContext,
  ICustomAppState,
} from './typings';

import { errorHandlerMiddleware } from './middlewares/errorResponseMiddleware';

import { initModels } from './models';

import { winstonLogger } from './utilities/logger';

import { config } from './config/config';
import { router } from './routes';

initModels(config);

const app = new Koa<ICustomAppState, ICustomAppContext>();

// add custom context objects
app.context.logger = winstonLogger;

// Provides important security headers to make your app more secure
app.use(helmet());

// Enable cors with default options
app.use(cors());

// Enable bodyParser with default options
app.use(bodyParser());

// error middleware
app.use(errorHandlerMiddleware);

// global error logger
app.on('error', (err, ctx) => {
  ctx.logger.error(
    err.message,
    'base',
    err,
    err.stack,
  );
});

app.use(router.routes())
  .use(router.allowedMethods());

console.log(config);
export default app.listen(config.port);
