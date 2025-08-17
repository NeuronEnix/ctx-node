import { ValidateFunction } from "ajv";

import { ctxErr } from "../ctx/ctx.error";
import { TCtx } from "../ctx/ctx.types";

export function validateRequestData(
  ctx: TCtx,
  ajvValidator: ValidateFunction
): TCtx {
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
