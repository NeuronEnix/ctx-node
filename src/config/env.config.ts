import crypto from "crypto";
import { config } from "dotenv";
config();

const NODE_ENV = process.env.NODE_ENV || "local";

const INSTANCE = {
  ID: crypto.randomBytes(5).toString("hex"),
  VERSION: "0.0.0",
  NAME: "ec2",
  CREATED_AT: new Date(),
  SERVICE_NAME: process.env.SERVICE_NAME || "service-name",
  SEQ: 0,
  INFLIGHT: 0,
  LAST_HEARTBEAT: new Date(),
  PORT: parseInt(process.env.SERVICE_PORT || "3000", 10),
};

const SECRET = {
  JWT: {
    ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN_SECRET || "access-token-secret",
    REFRESH_TOKEN:
      process.env.JWT_REFRESH_TOKEN_SECRET || "refresh-token-secret",
  },
  API_KEY: process.env.API_KEY || "api-key",
};

const DB = {
  POSTGRES: {
    URL:
      process.env.DB_POSTGRES_URL ??
      "postgres://root:pass123@127.0.0.1:5432/db_name",
    SYNC: process.env.DB_POSTGRES_SYNC === "true",
    USE_SSL: process.env.DB_POSTGRES_USE_SSL === "true",
  },
  REDIS: {
    URL: process.env.DB_REDIS_URL ?? "redis://localhost:6379",
    PREFIX: `${NODE_ENV === "prod" ? "" : NODE_ENV + ":"}SERVICE_NAME:`,
  },
};

const AWS = {
  REGION: process.env.AWS_REGION ?? "ap-south-1",
};

const SERVICE = {
  GOOGLE: {
    URL: "",
  },
  AGGREGATOR: {
    IS_ENABLED: process.env.AGGREGATOR_CTX_IS_ENABLED === "true",
  },
};

export const CONFIG = {
  NODE_ENV,
  INSTANCE,
  SECRET,
  DB,
  AWS,
  SERVICE,
} as const;
