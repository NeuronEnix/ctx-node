import { ErrorObject } from "ajv";

type TCtxErrorData = {
  [key: string]: number | string | object | boolean | null;
};
type TCtxError = {
  name: string;
  msg: string;
  data?: TCtxErrorData;
  info?: unknown;
  cause?: unknown;
};
export class CtxError extends Error {
  data: { [key: string]: number | string | object | boolean | null };
  info?: unknown;
  constructor({ name, msg, data, info }: TCtxError) {
    super(msg);
    super.name = name;
    this.data = data || {};
    this.info = info;
  }
}

type TResErr = Partial<Pick<TCtxError, "data" | "info" | "msg">>;

export namespace ctxErr {
  export const general = {
    unknown: (e?: TResErr) =>
      new CtxError({
        name: "UNKNOWN_ERROR",
        msg: "Something went wrong",
        ...e,
      }),
    responseNotSet: (e?: TResErr) =>
      new CtxError({
        name: "RESPONSE_NOT_SET",
        msg: "Response not set",
        ...e,
      }),
    malformedRequestData: (e?: TResErr) =>
      new CtxError({
        name: "MALFORMED_REQUEST_DATA",
        msg: "Malformed request data",
        ...e,
      }),
    invalidApi: (e?: TResErr) =>
      new CtxError({
        name: "INVALID_API",
        msg: "Api doesn't exist",
        ...e,
      }),
    validationError: (e: TResErr & { info: ErrorObject[] }) => {
      return new CtxError({
        name: "INVALID_REQUEST_DATA",
        msg: e.info?.[0]
          ? `${e.info[0].instancePath.replaceAll("/", " ")} ${e.info[0].message}`
          : "Invalid request data",
        ...e,
      });
    },
  };

  export const auth = {
    notAuthorized: (e?: TResErr) =>
      new CtxError({
        name: "NOT_AUTHORIZED",
        msg: "Not authorized",
        ...e,
      }),
    invalidAccessToken: (e?: TResErr) =>
      new CtxError({
        name: "INVALID_ACCESS_TOKEN",
        msg: "Invalid access token",
        ...e,
      }),
    expiredAccessToken: (e?: TResErr) =>
      new CtxError({
        name: "EXPIRED_ACCESS_TOKEN",
        msg: "Access token expired",
        ...e,
      }),
    invalidApiKey: (e?: TResErr) =>
      new CtxError({
        name: "INVALID_API_KEY",
        msg: "Invalid api key",
        ...e,
      }),
  };

  export const user = {
    notConnected: (e?: TResErr) =>
      new CtxError({
        name: "USER_NOT_CONNECTED",
        msg: "User not connected",
        ...e,
      }),
  };
  export const channel = {
    notFound: (e?: TResErr) =>
      new CtxError({
        name: "CHANNEL_NOT_FOUND",
        msg: "Channel not found",
        ...e,
      }),
  };
}
