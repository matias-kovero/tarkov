/**
 * @packageDocumentation
 * @module Types
 */

import { Options, NormalizedOptions, Response } from "got/dist/source";


export interface ExtendOptions extends Options {
  bsgAgent?: boolean;
  unityAgent?: boolean;
  appVersion?: boolean;
  requestId?: boolean;
  bsgSession?: boolean;
}

export interface NormalOptions extends NormalizedOptions {
  bsgAgent?: boolean;
  unityAgent?: boolean;
  appVersion?: boolean;
  requestId?: boolean;
  bsgSession?: boolean;
}

export interface ApiResponse<Data = any> extends Response {
  body: {
    err: number;
    errmsg: string;
    data: Data;
  }
}