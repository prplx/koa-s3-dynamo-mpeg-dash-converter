import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes';
import converterQueue from './converterQueue';

const app = new Koa();

converterQueue.clean(5000);
app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

export default app;
