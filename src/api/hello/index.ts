import { Ctx } from "../../ctx/ctx";
import * as helloWorldApi from "./helloWorld.api";
import * as helloKaushikApi from "./helloKaushik.api";

export async function world(ctx: Ctx): Promise<Ctx> {
  const { auth, validate, execute } = helloWorldApi;
  return auth(ctx).then(validate).then(execute);
}

export async function kaushik(ctx: Ctx): Promise<Ctx> {
  const { auth, validate, execute } = helloKaushikApi;
  return auth(ctx).then(validate).then(execute);
}
