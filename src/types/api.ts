import { Options, NormalizedOptions, Response } from "got/dist/source";


export interface ExtendOptions extends Options {
  bsgAgent?: boolean;
  unityAgent?: boolean;
  appVersion?: boolean;
  requestId?: boolean;
}

export interface NormalOptions extends NormalizedOptions {
  bsgAgent?: boolean;
  unityAgent?: boolean;
  appVersion?: boolean;
  requestId?: boolean;
}

export interface ApiResponse<Data = any> extends Response {
  body: {
    err: number;
    errmsg: string;
    data: Data;
  }
}