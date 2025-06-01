import { CONFIG } from "../config/config";
import { CtxHeader, CtxMeta, CtxReq, CtxRes, CtxUser } from "./ctx.types";

export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  SERVER: "SERVER",
  NONE: "NONE",
} as const;

type CtxConstructor = {
  method: "GET" | "POST";
  path: string;
  header: CtxHeader;
  headerRaw: Record<string, string | string[] | undefined>;
  data: {
    userId?: string;
    [key: string]: unknown;
  };
  ip: string;
  ips: string[];
};

export class Ctx {
  id: string;
  meta: CtxMeta;
  req: CtxReq;
  res: CtxRes;
  user: CtxUser;

  constructor(data: CtxConstructor) {
    this.meta = this.buildMeta();
    this.id = this.meta.monitor.traceId;
    this.req = this.buildReq(data);
    this.user = this.buildUser();
    this.res = this.buildRes();
  }

  private buildMeta(): CtxMeta {
    const curTime = new Date();
    ++CONFIG.INSTANCE.SEQ;
    ++CONFIG.INSTANCE.INFLIGHT;
    return {
      serviceName: CONFIG.INSTANCE.SERVICE_NAME,
      instance: {
        id: CONFIG.INSTANCE.ID,
        createdAt: CONFIG.INSTANCE.CREATED_AT,
        seq: CONFIG.INSTANCE.SEQ,
        inflight: CONFIG.INSTANCE.INFLIGHT,
      },
      monitor: {
        traceId: `${CONFIG.INSTANCE.ID}-${CONFIG.INSTANCE.SEQ}`,
        spanId: `${CONFIG.INSTANCE.ID}-${CONFIG.INSTANCE.SEQ}`,
        stdout: [],
        dbLog: [],
        ts: {
          in: curTime,
        },
      },
    };
  }

  private buildReq(data: CtxConstructor): CtxReq {
    return {
      method: data.method,
      path: data.path,
      header: data.header,
      headerRaw: data.headerRaw,
      data: data.data,
      ip: data.ip,
      ips: data.ips,
    };
  }

  private buildRes(): CtxRes {
    return {
      code: "OK",
      msg: "OK",
      data: {},
    };
  }

  private buildUser(): CtxUser {
    return {
      id: "none",
      role: USER_ROLE.NONE,
      seq: this.req.header.clientInfo.seq,
      sessionId: this.req.header.clientInfo.sessionId,
      deviceId: this.req.header.clientInfo.deviceId,
      deviceName: this.req.header.clientInfo.deviceName,
      appVersion: this.req.header.clientInfo.appVersion,
      token: {
        access: "none",
        refresh: "none",
      },
    };
  }

  done(): void {
    this.meta.monitor.ts.out = new Date();
    this.meta.monitor.ts.execTime =
      this.meta.monitor.ts.out.getTime() - this.meta.monitor.ts.in.getTime();
    this.res.meta = {
      ctxId: this.meta.instance.id,
      traceId: this.meta.monitor.traceId,
      spanId: this.meta.monitor.spanId,
      inTime: this.meta.monitor.ts.in,
      outTime: this.meta.monitor.ts.out!,
      execTime: this.meta.monitor.ts.execTime!,
    };
    // decrease the number of request inflight when response of this request goes out
    CONFIG.INSTANCE.INFLIGHT--;
  }
}
