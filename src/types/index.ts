import type { Jsonifiable } from 'type-fest';
import type { ZodObject, ZodTypeAny } from 'zod';
import type { ResponseType } from '../enums.ts';
import type { FunctionLike, MockedFunction } from './mock.ts';

export type FallbackHanderOptions = {
  mockOptions: MockFetchOptions;
  requestInfo: RequestInfo | URL;
  requestInit: RequestInit | undefined;
};

export type ImplicitMethodMatcher = Omit<MatcherObj, 'method'> | RegExp | string | MatcherFunc;

export type ImplicitMethodMockSignature = (
  matcher: ImplicitMethodMatcher,
  resOptions?: ResponseOptions,
  mockOptions?: MockOptions
) => MockFetch;

export type Matcher = MatcherObj | RegExp | string | MatcherFunc;

export type MatcherFunc = (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => boolean;

export type MatcherObj = {
  body?: MatcherRecursiveObj;
  headers?: Record<string, RegExp | string | MatcherValueFunc>;
  method?: string;
  url?: RegExp | string | MatcherValueFunc;
};

export type MatcherRecursiveObj = { [key: string]: Jsonifiable | RegExp | MatcherValueFunc | MatcherRecursiveObj };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MatcherValueFunc = (value: any) => boolean;

export type MatcherZod = ZodObject<Record<string, ZodTypeAny>>;

export type MockFunc = MockedFunction<FunctionLike>;

export type MockFetchBare = MockedFunction<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>;

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

export type MockImplementation = (
  requestInfo: RequestInfo | URL,
  requestInit?: RequestInit
) => MockImplementationCheckpoint;

export type MockImplementationCheckpoint = {
  isMatch: boolean;
  resolve: () => Promise<Response>;
};

export type MockOptions = {
  /**
   * How long to delay the response in milliseconds.
   */
  delay?: number;
  /**
   * The type of the response body, can be 'arraybuffer', 'blob',
   * 'formdata', 'json' or 'text. The default is 'json'.
   */
  responseType?: ResponseType;
  /**
   * The number of times to apply the mock to a matching request.
   * The default is infinity.
   */
  times?: number;
};

export type MockSignature = (matcher: Matcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => MockFetch;

export type NormalisedRequest = {
  body?: unknown;
  headers?: Record<string, string>;
  method: string;
  url: string;
};

export type ResponseOptionsObj = ResponseInit & { body?: Jsonifiable };

export type ResponseOptions = ResponseOptionsObj | number | string;
