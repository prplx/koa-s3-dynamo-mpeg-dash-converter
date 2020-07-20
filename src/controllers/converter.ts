import { Middleware } from 'koa';
import validate from '../validator';
import converterQueue from '../converterQueue';

export const convert: Middleware[] = [
  validate('/convert'),
  async ctx => {
    const { url } = ctx.request.body;
    converterQueue.add({ url });
    ctx.status = 200;
  },
];
