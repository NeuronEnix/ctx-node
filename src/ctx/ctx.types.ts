export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  SERVER: "SERVER",
  NONE: "NONE",
} as const;

type CtxReq = {
  header: {
    auth: string;
    apiKey?: string;
    clientInfo: {
      seq: number;
      sessionId: string;
      deviceId: string;
      deviceName: string;
      appVersion: string;
      userAgent: string;
    };
  };
  headerRaw: Record<string, string | string[] | undefined>;
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
    traceId: string;
    spanId: string;
    inTime: Date;
    outTime?: Date;
    execTime?: number;
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
  monitor: {
    traceId: string;
    spanId: string;
    stdout: string[];
    dbLog: string[];
    ts: {
      in: Date; // request in time
      out?: Date; // request out time
      execTime?: number; // total execution time
    };
  };
};

type CtxUser = {
  id: string;
  role: keyof typeof USER_ROLE;
  seq: number;
  sessionId: string;
  deviceName: string;
  deviceId: string;
  appVersion: string;
  token: {
    access: string;
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
