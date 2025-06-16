// --------------------------------------------------
// WebSocket (API GW v2) Events
// --------------------------------------------------

interface WebSocketRequestContextBase {
  routeKey: "$default" | "$connect" | "$disconnect" | "$default" | "$message";
  eventType: "CONNECT" | "DISCONNECT" | "MESSAGE";
  extendedRequestId: string;
  requestTime: string;
  messageDirection: "IN" | string;
  stage: string;
  connectedAt: number;
  requestTimeEpoch: number;
  identity: {
    sourceIp: string;
  };
  requestId: string;
  domainName: string;
  connectionId: string;
  apiId: string;
  http: never;
}

// CONNECT
export interface APIGatewayWebSocketConnectEvent {
  headers: Record<string, string>;
  multiValueHeaders: Record<string, string[]>;
  queryStringParameters?: Record<string, string>;
  multiValueQueryStringParameters?: Record<string, string[]>;
  requestContext: WebSocketRequestContextBase & {
    eventType: "CONNECT";
  };
  body: Record<string, unknown>;
  isBase64Encoded: boolean;
}

// DISCONNECT
export interface APIGatewayWebSocketDisconnectEvent {
  headers: Record<string, string>;
  multiValueHeaders: Record<string, string[]>;
  requestContext: WebSocketRequestContextBase & {
    eventType: "DISCONNECT";
    disconnectStatusCode: number;
    disconnectReason?: string;
  };
  body: Record<string, unknown>;
  queryStringParameters: never;
  isBase64Encoded: boolean;
}

// MESSAGE
export interface APIGatewayWebSocketMessageEvent {
  headers?: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  requestContext: WebSocketRequestContextBase & {
    eventType: "MESSAGE";
    messageId: string;
  };
  body: Record<string, unknown>;
  queryStringParameters: never;
  isBase64Encoded: boolean;
}

// --------------------------------------------------
// HTTP API v2 Events
// --------------------------------------------------

export interface APIGatewayHttpApiV2Event {
  version: "2.0";
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string>;
  requestContext: {
    accountId: string;
    apiId: string;
    domainName: string;
    domainPrefix: string;
    http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    requestId: string;
    routeKey: string;
    eventType: never;
    stage: string;
    time: string;
    timeEpoch: number;
    identity: never;
    connectionId: never;
  };
  body: Record<string, unknown>;
  isBase64Encoded: boolean;
}

// --------------------------------------------------
// Union of all possible entry points
// --------------------------------------------------

export type APIGatewayEvent =
  | APIGatewayWebSocketConnectEvent
  | APIGatewayWebSocketDisconnectEvent
  | APIGatewayWebSocketMessageEvent
  | APIGatewayHttpApiV2Event;
