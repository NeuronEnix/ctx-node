import { CONFIG } from "../config/env.config";
import jwt from "jsonwebtoken";
import { ctxErr } from "../ctx/ctx.error";
import { TCtx, USER_ROLE } from "../ctx/ctx.types";

type TTokenPayload = {
  userId: string;
  role: keyof typeof USER_ROLE;
};

class Auth {
  verifyApiKey(ctx: TCtx): TCtx {
    const apiKey = ctx.req.header.auth;

    if (apiKey !== CONFIG.SECRET.API_KEY)
      throw ctxErr.auth.invalidApiKey({ info: { apiKey } });

    ctx.user.id = "server_user_id";
    ctx.user.role = USER_ROLE.SERVER;
    return ctx;
  }

  verifyBearerToken(ctx: TCtx): TCtx {
    const authToken = ctx.req.header.auth;
    if (typeof authToken !== "string") throw ctxErr.auth.invalidAccessToken();
    const accessToken = authToken.replace("Bearer ", "");
    try {
      const tokenPayload = jwt.verify(
        accessToken,
        CONFIG.SECRET.JWT.ACCESS_TOKEN,
        { algorithms: ["HS256"] }
      ) as TTokenPayload;
      ctx.user.id = tokenPayload.userId;
      ctx.user.role = tokenPayload.role;
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError)
        throw ctxErr.auth.expiredAccessToken();
      if (e instanceof jwt.JsonWebTokenError)
        throw ctxErr.auth.invalidAccessToken();
      throw e;
    }
    return ctx;
  }

  async verifyAuth(ctx: TCtx): Promise<TCtx> {
    const authToken = ctx.req.header.auth;
    if (typeof authToken !== "string") throw ctxErr.auth.invalidAccessToken();

    if (authToken.startsWith("Bearer ")) this.verifyBearerToken(ctx);
    else if (authToken.startsWith("svc_")) this.verifyApiKey(ctx);

    // attach user id to request data if not present
    if (!ctx.req.data.userId) ctx.req.data.userId = ctx.user.id;
    console.log(`User: ${ctx.user.id} | Role: ${ctx.user.role}`);
    this.restrictUserByUserId(ctx, ctx.req.data?.userId as string);
    return ctx;
  }

  restrictUserByUserId(ctx: TCtx, userId: string) {
    switch (ctx.user.role) {
      case USER_ROLE.USER: {
        if (ctx.user.id !== userId) throw ctxErr.auth.notAuthorized();
        break;
      }
      case USER_ROLE.ADMIN:
        break;
      case USER_ROLE.SERVER:
        break;
      default:
        throw ctxErr.auth.notAuthorized();
    }
  }
}

export const auth = new Auth();
