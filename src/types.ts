import { type FunctionLike, type MockedFunction as JestMockedFunction } from 'jest-mock';
import type { Jsonifiable } from 'type-fest';
import { type MockedFunction as VitestMockedFunction } from 'vitest';
import type { ZodObject, ZodTypeAny } from 'zod';

export type FallbackHanderOptions = {
  finalResponseOptions: {
    body: string | Blob | FormData | Uint8Array | undefined;
    headers: Record<string, string>;
    status: number;
    statusText: string | undefined;
  };
  initialResponseOptions: ResponseOptions;
  matcher: MatcherFunc | MatcherZod;
  mockOptions: MockOptions;
  normalisedRequest: ReturnType<typeof import('./helpers/normaliseRequest.ts')['normaliseRequest']>;
  requestInfo: RequestInfo | URL;
  requestInit: RequestInit | undefined;
};

export type FetchMethod = 'get' | 'post' | 'put' | 'delete';

export type ImplicitMethodMatcher = Omit<MatcherObj, 'method'> | RegExp | string | MatcherFunc;

export type ImplicitMethodMockSignature = (
  matcher: ImplicitMethodMatcher,
  resOptions?: ResponseOptions | number,
  mockOptions?: MockOptions
) => MockFetch;

export type Matcher = MatcherObj | RegExp | string | MatcherFunc;

export type MatcherFunc = (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => boolean;

export type MatcherObj = {
  body?: Jsonifiable;
  headers?: Record<string, RegExp | string>;
  method?: string;
  url?: RegExp | string;
};

export type MatcherZod = ZodObject<Record<string, ZodTypeAny>>;

export type MockFunc = VitestMockedFunction<FunctionLike> | JestMockedFunction<FunctionLike>;

export type MockFetchBare =
  | VitestMockedFunction<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>
  | JestMockedFunction<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>;

export type MockFetch = MockFetchBare & {
  mockDelete: ImplicitMethodMockSignature;
  mockDeleteOnce: ImplicitMethodMockSignature;
  mockGet: ImplicitMethodMockSignature;
  mockGetOnce: ImplicitMethodMockSignature;
  mockPost: ImplicitMethodMockSignature;
  mockPostOnce: ImplicitMethodMockSignature;
  mockPut: ImplicitMethodMockSignature;
  mockPutOnce: ImplicitMethodMockSignature;
  mockRequest: MockSignature;
  mockRequestOnce: MockSignature;
};

export type MockFetchOptions = {
  /**
   * Callback to invoke if no matching mock is found, which can be
   * useful for debugging why no matching mock is found.
   */
  fallbackHandler?: (options: FallbackHanderOptions) => void;

  /**
   * Whether to allow requests through to the network if
   * no matching mock is found. The default is false.
   */
  fallbackToNetwork?: boolean;
  /**
   * The type of the response body, can be 'arraybuffer', 'blob',
   * 'formdata', 'json' or 'text. The default is 'json'.
   */
  responseType?: ResponseType;
  /**
   * Whether to print a warning to the console when a
   * request is allowed through to the network. The default
   * is false.
   */
  warnOnFallback?: boolean;
};

export type MockOptions = MockFetchOptions & {
  delay?: number;
};

export type MockSignature = (
  matcher: Matcher,
  resOptions?: ResponseOptions | number,
  mockOptions?: MockOptions
) => MockFetch;

export type NormalisedRequest = {
  body?: unknown;
  headers?: Record<string, string>;
  method: string;
  url: string;
};

export type ResponseOptions = ResponseInit & { body?: Jsonifiable };

export enum ResponseType {
  ARRAY_BUFFER = 'arraybuffer',
  BLOB = 'blob',
  FORM_DATA = 'formdata',
  JSON = 'json',
  TEXT = 'text',
}
