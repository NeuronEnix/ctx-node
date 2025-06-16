import { AxiosError } from "axios";

import { ctxErr, CtxError } from "./ctx.error";
import { TCtx } from "./ctx.types";
import * as api from "../api/index";

export async function ctxRouter(ctx: TCtx): Promise<TCtx> {
  try {
    const reqPath = `${ctx.req.method} ${ctx.req.path}`;
    console.log(
      `CtxReq: [${reqPath}] | [IP: ${ctx.req.ips || ctx.req.ip}] | [TraceId: ${ctx.meta.monitor.traceId}] | [SpanId: ${ctx.meta.monitor.spanId}]`
    );
    console.log(
      `CtxUser: [Session: ${ctx.user.sessionId}] | [Seq: ${ctx.user.seq}]`
    );
    console.log(
      `CtxMeta: [Seq: ${ctx.meta.instance.seq}] | [Inflight: ${ctx.meta.instance.inflight}]`
    );
    switch (reqPath) {
      case "GET /hello/world":
        await api.hello.world(ctx);
        break;
      case "GET /hello/kaushik":
        await api.hello.kaushik(ctx);
        break;

      case "GET /ping":
        await api.ping.ping(ctx);
        break;

      default:
        ctxErr.general.invalidApi();
    }

    return ctx;
  } catch (e) {
    if (e instanceof CtxError) {
      console.log("CtxError:name:", e.name);
      console.log("CtxError:message:", e.message);
      console.log("CtxError:data:", e.data);
      if (e.info) {
        ctx.meta.monitor.stdout.push(JSON.stringify(e.info));
      }
      if (e.info instanceof AxiosError) {
        console.log(
          "CtxError:info:AxiosError:config",
          e.info.config?.data ?? e.info.config ?? "no config data"
        );
        console.log(
          "CtxError:info:AxiosError:response",
          e.info.response?.data ?? e.info.response ?? "no response data"
        );
      } else if (typeof e.info === "object") {
        console.log("CtxError:info:object:", JSON.stringify(e.info));
      } else {
        console.log("CtxError:info:", e.info);
      }
      if (e.stack) {
        console.log("CtxError:stack:", e.stack);
      }
      ctx.res = { code: e.name, msg: e.message, data: e.data };
      return ctx;
    }

    // ideally should never come here, god forbid it did
    console.log("CtxError:unknown:fatal", e);
    const error = ctxErr.general.unknown();
    ctx.res = {
      code: error.name,
      msg: error.message,
      data: {},
    };
    return ctx;
  }
}
