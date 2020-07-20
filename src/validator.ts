import { string, object } from 'yup';
import { Context, Next } from 'koa';

const convertParamsSchema = object().shape({
  url: string().url().required(),
});

const map = {
  '/convert': convertParamsSchema,
};

const validate = (route: keyof typeof map) => async (
  ctx: Context,
  next: Next
) => {
  try {
    await map[route].validate(ctx.request.body);
  } catch (error) {
    ctx.throw(400, `${error}`);
  }
  await next();
};

export default validate;
