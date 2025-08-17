import { TCtx, USER_ROLE } from "ctx-router";
import { ctxErr } from "../../ctx/ctx.error";

export async function execute(reqData: TReqData): Promise<TResData> {
  return {
    userId: reqData.userId,
    userName: reqData.userName,
  };
}

export async function auth(ctx: TCtx): Promise<TCtx> {
  // authenticate the request, and return the context if the request is authenticated
  // await authRequest(ctx);
  if (USER_ROLE.user === ctx.user.role) return ctx;
  if (USER_ROLE.admin === ctx.user.role) return ctx;
  throw ctxErr.auth.notAuthorized();
}

export async function validate(ctx: TCtx): Promise<TReqData> {
  // Validate request data and return the request data
  return ctx.req.data as TReqData;
}

type TReqData = {
  userId: string;
  userName: string;
};
type TResData = {
  userId: string;
  userName: string;
};
