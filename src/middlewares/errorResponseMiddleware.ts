import { MessageBag } from './../utilities/messageBag';
import { ErrorTransformer } from './../transformers';

const errorHandlerMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.message === 'Not Found') {
      const response = new MessageBag(new ErrorTransformer());
      response.setNotFound();
      ctx.body = response.serialize();
      ctx.status = response.status;
    } else {
      const response = new MessageBag(new ErrorTransformer());
      response.setError();
      ctx.body = response.serialize();
      ctx.status = response.status;
      ctx.app.emit('error', err, ctx);
    }
  }
};

export { errorHandlerMiddleware };
