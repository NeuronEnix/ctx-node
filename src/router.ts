import { CtxRouter, TCtx } from "ctx-router";
import * as api from "./api/index";

export const router = new CtxRouter<TCtx>();

// Health API
router.handle("GET", "/health/ping", api.health.ping);

// User API
router.handle("POST", "/user/update", api.user.update);
router.handle("GET", "/user/detail", api.user.detail);
