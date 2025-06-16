export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  SERVER: "SERVER",
  NONE: "NONE",
} as const;

type CtxReq = {
  header: {
    authorization?: string;
    "x-ctx-device-name"?: string;
    "x-ctx-device-id"?: string;
    "x-ctx-os"?: string;
    "x-ctx-app-version"?: string;
    "x-ctx-session-id"?: string;
    "x-ctx-seq"?: string;
    "x-ctx-api-version"?: string;
    "x-ctx-refresh-token"?: string;
    [key: string]: string | string[] | undefined;
  };
  method: string;
  path: string;
  data: {
    userId?: string;
    [key: string]: unknown;
  };
  ip: string;
  ips: string[];
};

type CtxRes = {
  code: string;
  msg: string;
  data: { [key: string]: unknown };
  meta?: {
    ctxId: string;
    seq: number;
    traceId: string;
    spanId: string;
    inTime: Date;
    outTime: Date;
    execTime: number;
    owd: number;
  };
};

type CtxMeta = {
  serviceName: string;
  instance: {
    id: string;
    createdAt: Date;
    seq: number;
    inflight: number; // number of request inflight when this request came in
  };
  ts: {
    in: Date;
    clientIn: Date;
    owd: number;
    out?: Date;
    execTime?: number;
  };
  monitor: {
    traceId: string;
    spanId: string;
    stdout: string[];
    dbLog: string[];
  };
};

type CtxUser = {
  id: string;
  role: keyof typeof USER_ROLE;
  deviceName: string;
  deviceId: string;
  os: string;
  appVersion: string;
  sessionId: string;
  seq: number;
  apiVersion: string;
  auth: {
    token: string;
    refresh: string;
  };
};

export type TCtx = {
  id: string;
  meta: CtxMeta;
  req: CtxReq;
  res: CtxRes;
  user: CtxUser;
};

export interface IBaseApi {
  auth(ctx: TCtx): Promise<TCtx>;
  validate(ctx: TCtx): Promise<TCtx>;
  handle(ctx: TCtx): Promise<TCtx>;
}
