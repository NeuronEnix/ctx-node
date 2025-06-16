import { APIGatewayEvent } from "./lambda.types";
import { ctxRouter } from "../../ctx/ctx.router";
import { ctxErr, CtxError } from "../../ctx/ctx.error";
import { TCtx } from "../../ctx/ctx.types";
import { buildCtx, doneCtx } from "../../ctx/ctx";
import { validateWebSocketMessage } from "../../common/helper";

function getHttpCode(ctx: TCtx) {
  if (typeof ctx.res?.code !== "string") return 500;
  switch (ctx.res.code) {
    case "OK":
      return 200;
    case "UNKNOWN_ERROR":
      return 500;
    default:
      return 400;
  }
}

export const handler = async (event: APIGatewayEvent) => {
  try {
    event.body = JSON.parse((event.body as unknown as string) || "{}");

    const { method, path, data, ip } = (() => {
      const query = event.queryStringParameters || {};
      if (event.requestContext.http) {
        const method = event.requestContext.http.method;
        return {
          method: method,
          path: event.requestContext.http.path,
          data: method === "POST" ? event.body : query,
          ip: event.requestContext.http.sourceIp,
        };
      }
      event.body.connectionId = event.requestContext.connectionId;
      const path =
        {
          CONNECT: "/primitive/connect",
          DISCONNECT: "/primitive/disconnect",
          MESSAGE: "/primitive/message",
        }[event.requestContext.eventType] || "/unknown";
      if (event.requestContext.eventType === "CONNECT") {
        if (
          typeof event.queryStringParameters?.token === "string" &&
          event.headers
        ) {
          event.headers.authorization = event.queryStringParameters.token;
        }
      } else if (event.requestContext.eventType === "MESSAGE") {
        if (!event.headers) event.headers = {};
        if (!event.body.data) event.body.data = {};
        validateWebSocketMessage({
          path: event.body.path as string,
          headers: event.body.headers as Record<string, string>,
          data: event.body.data as Record<string, unknown>,
        });
        Object.assign(event.headers, event.body.headers || {});
        return {
          method: event.requestContext.eventType,
          path: event.body.path as string,
          data: event.body.data as Record<string, unknown>,
          ip: event.requestContext.identity.sourceIp,
        };
      }
      return {
        method: event.requestContext.eventType,
        path: path,
        data: event.body,
        ip: event.requestContext.identity.sourceIp,
      };
    })();

    const ctx: TCtx = buildCtx({
      method: method as "GET" | "POST" | "CONNECT" | "DISCONNECT" | "MESSAGE",
      path: path,
      header: event.headers || {},
      data: data,
      ip: ip,
      ips: [ip],
    });

    await ctxRouter(ctx).then(doneCtx);

    return {
      statusCode: getHttpCode(ctx),
      body: JSON.stringify(ctx.res),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      const e = ctxErr.general.malformedRequestData();
      return {
        statusCode: 400,
        body: JSON.stringify({
          name: e.name,
          msg: e.message,
          data: e.data,
        }),
        headers: { "Content-Type": "application/json" },
      };
    } else if (err instanceof CtxError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          name: err.name,
          msg: err.message,
          data: err.data,
        }),
        headers: { "Content-Type": "application/json" },
      };
    }
    console.error("UNKNOWN_ERROR:SERVER:LAMBDA:HANDLER", err);
    const e = ctxErr.general.unknown();
    return {
      statusCode: 500,
      body: JSON.stringify({ name: e.name, msg: e.message, data: e.data }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

// Add uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT_EXCEPTION:", err);
  throw err;
});

// Add unhandled rejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED_REJECTION:", promise, "reason:", reason);
  throw reason;
});
