import { CONFIG } from "../config/env.config";
import { TCtx, USER_ROLE } from "./ctx.types";
import { logCtx } from "./ctx.logger";

type TCtxBuild = {
  method: "GET" | "POST" | "CONNECT" | "DISCONNECT" | "MESSAGE";
  path: string;
  header: Record<string, string | string[] | undefined>;
  data: Record<string, unknown>;
  ip: string;
  ips: string[];
};

export function buildCtx(ctxRaw: TCtxBuild) {
  const meta = buildMeta(ctxRaw);
  const req = buildReq(ctxRaw);
  const user = buildUser(ctxRaw);
  const res = buildRes();
  const id = meta.monitor.traceId;
  return { id, meta, req, user, res };
}

export async function doneCtx(ctx: TCtx): Promise<void> {
  ctx.meta.ts.out = new Date();
  ctx.meta.ts.execTime = ctx.meta.ts.out.getTime() - ctx.meta.ts.in.getTime();

  // Log context using ctxLogger
  await logCtx(ctx);
  setResMeta(ctx);
  // decrease the number of request inflight when response of this request goes out
  CONFIG.INSTANCE.INFLIGHT--;
}

function buildMeta(ctxRaw: TCtxBuild): TCtx["meta"] {
  const inTime = new Date();
  ++CONFIG.INSTANCE.SEQ;
  ++CONFIG.INSTANCE.INFLIGHT;

  // Extract clientIn from header and validate if it's a valid date using IIFE
  const clientIn = (() => {
    const dtStr = ctxRaw.header["x-ctx-ts"];
    if (typeof dtStr !== "string") return inTime;
    const dt = new Date(dtStr);
    if (isNaN(dt.getTime())) return inTime;
    return dt;
  })();

  return {
    serviceName: CONFIG.INSTANCE.SERVICE_NAME,
    instance: {
      id: CONFIG.INSTANCE.ID,
      createdAt: CONFIG.INSTANCE.CREATED_AT,
      seq: CONFIG.INSTANCE.SEQ,
      inflight: CONFIG.INSTANCE.INFLIGHT,
    },
    ts: {
      in: inTime,
      clientIn: clientIn,
      owd: inTime.getTime() - clientIn.getTime(),
    },
    monitor: {
      traceId: `${CONFIG.INSTANCE.ID}-${CONFIG.INSTANCE.SEQ}`,
      spanId: `${CONFIG.INSTANCE.ID}-${CONFIG.INSTANCE.SEQ}`,
      stdout: [],
      dbLog: [],
    },
  };
}

function buildReq(data: TCtxBuild): TCtx["req"] {
  return {
    method: data.method,
    path: data.path,
    header: data.header,
    data: data.data,
    ip: data.ip,
    ips: data.ips,
  };
}

function buildUser(ctxRaw: TCtxBuild): TCtx["user"] {
  const header = ctxRaw.header;
  const clientSeq = Number(header["x-ctx-seq"]);
  return {
    id: "none",
    role: USER_ROLE.NONE,
    seq: isNaN(clientSeq) ? 0 : clientSeq,
    sessionId: String(header["x-ctx-session-id"] || "none"),
    deviceId: String(header["x-ctx-device-id"] || "none"),
    deviceName: String(header["x-ctx-device-name"] || "none"),
    appVersion: String(header["x-ctx-app-version"] || "none"),
    os: String(header["x-ctx-os"] || "none"),
    apiVersion: String(header["x-ctx-api-version"] || "none"),
    auth: {
      token: String(
        header["authorization"] || header["Authorization"] || "none"
      ),
      refresh: String(header["x-ctx-refresh-token"] || "none"),
    },
  };
}

function buildRes(): TCtx["res"] {
  return {
    code: "OK",
    msg: "OK",
    data: {},
  };
}

function setResMeta(ctx: TCtx): void {
  const meta = ctx.meta;
  ctx.res.meta = {
    ctxId: ctx.id,
    seq: ctx.user.seq,
    traceId: meta.monitor.traceId,
    spanId: meta.monitor.spanId,
    inTime: meta.ts.in,
    outTime: meta.ts.out!,
    execTime: meta.ts.execTime!,
    owd: meta.ts.owd,
  };
}
