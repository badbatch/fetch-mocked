import { type FunctionLike, type MockedFunction as JestMockedFunction } from 'jest-mock';
import type { Jsonifiable } from 'type-fest';
import { type MockedFunction as VitestMockedFunction } from 'vitest';

export type Matcher = {
  body?: Jsonifiable;
  headers?: Record<string, RegExp | string>;
  method?: string;
  url?: RegExp | string;
};

export type MockFunc = VitestMockedFunction<FunctionLike> | JestMockedFunction<FunctionLike>;

export type MockFetch =
  | VitestMockedFunction<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>
  | JestMockedFunction<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>;

export type MockOptions = {
  delay?: number;
};

export type MockSignature = (
  matcher: Omit<Matcher, 'method'> | RegExp | string,
  resOptions?: ResOptions,
  mockOptions?: MockOptions
) => void;

export type NormalisedRequest = {
  body?: unknown;
  headers?: Record<string, string>;
  method: string;
  url: string;
};

export type ResOptions = ResponseInit & { body?: Jsonifiable; headers?: Record<string, string> };
