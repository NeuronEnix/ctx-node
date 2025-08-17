import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { CONFIG } from "../config/env.config";
import { ctxErr } from "../ctx/ctx.error";
import { toCtx, TCtx } from "ctx-router";
import { router } from "../router";

const app = express();

function getPath(url: string): string {
  const queryParamPos = url.indexOf("?");
  if (queryParamPos === -1) return url;
  return url.substring(0, queryParamPos);
}

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/{*any}", async (req: Request, res: Response) => {
  if (req.method !== "GET" && req.method !== "POST") {
    res.sendStatus(404);
    return;
  }
  const ctx: TCtx = toCtx.fromExpress(req);
  await router.exec(req.method, getPath(req.url), ctx);
  res.type("application/json").status(getHttpCode(ctx)).send(ctx.res);
});

app.use(
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof SyntaxError) {
      const e = ctxErr.general.malformedRequestData();
      res.status(400).json({
        name: e.name,
        msg: e.message,
        data: e.data,
      });
    }
  }
);

console.log("Starting server initialization...");
console.log("Configuration:", {
  port: CONFIG.INSTANCE.PORT,
  serviceName: CONFIG.INSTANCE.SERVICE_NAME,
  nodeEnv: CONFIG.NODE_ENV,
});

app
  .listen(CONFIG.INSTANCE.PORT, () => {
    console.log(`Express server listening on port ${CONFIG.INSTANCE.PORT}`);
  })
  .on("error", (err) => {
    console.error("EXPRESS_SERVER_ERROR:", err);
    process.exit(1);
  });

// Add uncaught exception handler
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT_EXCEPTION:", err);
});

// Add unhandled rejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED_REJECTION:", promise, "reason:", reason);
});
