import { CONFIG } from "../config/env.config";
import { TCtx } from "ctx-router";

export const logCtx = async (ctx: TCtx): Promise<TCtx> => {
  try {
    if (!CONFIG.SERVICE.AGGREGATOR.IS_ENABLED) return ctx;
    return ctx;
  } catch (e: unknown) {
    console.log("CtxLogger:error:UNKNOWN_ERROR", JSON.stringify(e));
    if (e instanceof Error) {
      console.log("CtxLogger:error:UNKNOWN_ERROR:stack", e.stack);
    }
    return ctx;
  }
};
