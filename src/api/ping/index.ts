import { TCtx } from "../../ctx/ctx.types";
import * as pingApi from "./ping.api";

export async function ping(ctx: TCtx): Promise<TCtx> {
  const { auth, validate, execute } = pingApi;
  return auth(ctx).then(validate).then(execute);
}
