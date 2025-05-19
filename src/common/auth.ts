import { CONFIG } from "../ctx/ctx.config";
import jwt from "jsonwebtoken";
import { ctxErr } from "../ctx/ctx.error";
import { TCtx, USER_ROLE } from "../ctx/ctx.types";

type TTokenPayload = {
  userId: string;
  role: keyof typeof USER_ROLE;
};

class Auth {
  async verifyAccessToken(ctx: TCtx): Promise<TCtx> {
    const bearerToken = ctx.req.header.auth;
    if (typeof bearerToken !== "string") throw ctxErr.auth.invalidAccessToken();

    const accessToken = bearerToken.replace("Bearer ", "");
    try {
      const tokenPayload = jwt.verify(
        accessToken,
        CONFIG.SECRET.JWT.ACCESS_TOKEN,
        { algorithms: ["HS256"] }
      ) as TTokenPayload;
      ctx.user.id = tokenPayload.userId;
      ctx.user.role = tokenPayload.role;

      if (!ctx.req.data.userId) ctx.req.data.userId = ctx.user.id;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError)
        throw ctxErr.auth.expiredAccessToken();
      if (e instanceof jwt.JsonWebTokenError)
        throw ctxErr.auth.invalidAccessToken();
      throw e;
    }
    console.log(`User: ${ctx.user.id} | Role: ${ctx.user.role}`);
    this.restrictUserByUserId(ctx, ctx.req.data?.userId as string);
    return ctx;
  }

  restrictUserByUserId(ctx: TCtx, userId: string) {
    switch (ctx.user.role) {
      case USER_ROLE.user: {
        if (ctx.user.id !== userId) throw ctxErr.auth.notAuthorized();
        break;
      }
      case USER_ROLE.admin:
        break;
      case USER_ROLE.server:
        break;
      default:
        throw ctxErr.auth.notAuthorized();
    }
  }
}

export const auth = new Auth();
