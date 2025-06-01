import { ValidateFunction } from "ajv";

import { ctxErr } from "../ctx/ctx.error";
import { Ctx } from "../ctx/ctx";

export function validateRequestData(
  ctx: Ctx,
  ajvValidator: ValidateFunction
): Ctx {
  const dataValidated = ajvValidator(ctx.req.data);
  if (!dataValidated) {
    // type guard to satisfy typescript, but should never happen
    if (!ajvValidator.errors) {
      throw ctxErr.general.unknown({ info: ajvValidator });
    }
    throw ctxErr.general.validationError({ info: ajvValidator.errors });
  }
  return ctx;
}
