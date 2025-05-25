import crypto from "crypto";
import { config } from "dotenv";
config();

const NODE_ENV = process.env.NODE_ENV || "local";

const INSTANCE = {
  ID: crypto.randomBytes(5).toString("hex"),
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
  API_KEY: process.env.API_KEY || "svc_api_key",
};

const DB = {
  MONGO: {
    HOST: process.env.DB_MONGO_HOST ?? "localhost",
    PORT: parseInt(process.env.DB_MONGO_PORT ?? "27017", 10),
    USER: process.env.DB_MONGO_USER ?? "root",
    PASS: process.env.DB_MONGO_PASS ?? "pass123",
    DATABASE: process.env.DB_MONGO_DATABASE ?? "db_name",
  },
  POSTGRES: {
    HOST: process.env.DB_POSTGRES_HOST ?? "127.0.0.1",
    PORT: parseInt(process.env.DB_POSTGRES_PORT ?? "5432", 10),
    USER: process.env.DB_POSTGRES_USER ?? "root",
    PASS: process.env.DB_POSTGRES_PASS ?? "pass123",
    DATABASE: process.env.DB_POSTGRES_DATABASE ?? "db_name",
  },
  REDIS: {
    URL: process.env.DB_REDIS_URL ?? "redis://localhost:6379",
    PREFIX: `${NODE_ENV === "prod" ? "" : `${NODE_ENV}:${INSTANCE.SERVICE_NAME.toUpperCase()}:`}`,
  },
};

const AWS = {
  REGION: process.env.AWS_REGION ?? "ap-south-1",
};

const SERVICE = {
  GOOGLE: {
    URL: "",
  },
};

export const CONFIG = {
  NODE_ENV,
  INSTANCE,
  SECRET,
  DB,
  AWS,
  SERVICE,
};
