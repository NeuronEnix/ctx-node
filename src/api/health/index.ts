import { TCtx } from "ctx-router";

import * as healthPing from "./healthPing.api";

export async function ping(ctx: TCtx): Promise<TCtx> {
  const { auth, validate, execute } = healthPing;
  ctx.res.data = await auth(ctx).then(validate).then(execute);
  return ctx;
}
