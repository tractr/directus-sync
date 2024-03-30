export interface PinoHTTPLog {
  level: number;
  time: number;
  pid: number;
  hostname: string;
  req: Req;
  res: Res;
  responseTime: number;
  msg: string;
}

export interface Req {
  id: number;
  method: string;
  url: string;
  query: Query;
  params: Params;
  headers: ReqHeaders;
}

export interface ReqHeaders {
  host: string;
  connection: string;
  'content-type': string;
  authorization: string;
  accept: string;
  'accept-language': string;
  'sec-fetch-mode': string;
  'user-agent': string;
  'accept-encoding': string;
}

export interface Params {}

export interface Query {
  filter: string;
}

export interface Res {
  statusCode: number;
  headers: ResHeaders;
}

export interface ResHeaders {
  'content-security-policy': string;
  'x-powered-by': string;
  'cache-control': string;
  vary: string;
  'content-type': string;
  'content-length': string;
  etag: string;
}
