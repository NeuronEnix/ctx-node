import { TCtx } from "../../ctx/ctx.types";
import * as helloWorldApi from "./helloWorld.api";
import * as helloKaushikApi from "./helloKaushik.api";

export async function world(ctx: TCtx): Promise<TCtx> {
  const { auth, validate, execute } = helloWorldApi;
  return auth(ctx).then(validate).then(execute);
}

export async function kaushik(ctx: TCtx): Promise<TCtx> {
  const { auth, validate, execute } = helloKaushikApi;
  return auth(ctx).then(validate).then(execute);
}
