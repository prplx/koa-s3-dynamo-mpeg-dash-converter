import Router from 'koa-router';
import * as converterController from './controllers/converter';

const router = new Router();

router
  .get('/', ctx => {
    ctx.body = 'Server is OK';
  })
  .post('/convert', ...converterController.convert);

export default router;
