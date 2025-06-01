import { Ctx } from "../../ctx/ctx";
import * as pingApi from "./ping.api";

export async function ping(ctx: Ctx): Promise<Ctx> {
  const { auth, validate, execute } = pingApi;
  return auth(ctx).then(validate).then(execute);
}
