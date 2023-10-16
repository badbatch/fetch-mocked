import { createMockImplementation } from './helpers/createMockImplementation.ts';
import { jsonToZod } from './helpers/jsonToZod.ts';
import { normaliseMatcher } from './helpers/normaliseMatcher.ts';
import type { Matcher, MockFetch, MockFunc, MockOptions, MockSignature, ResOptions } from './types.ts';

const globalFetch = globalThis.fetch;

export const mockFetch = (mockFunc: () => MockFunc) => {
  globalThis.fetch = mockFunc();

  const mockedFetch = globalThis.fetch as MockFetch & {
    mockDelete: MockSignature;
    mockDeleteOnce: MockSignature;
    mockGet: MockSignature;
    mockGetOnce: MockSignature;
    mockPost: MockSignature;
    mockPostOnce: MockSignature;
    mockPut: MockSignature;
    mockPutOnce: MockSignature;
    mockRequest: (matcher: Matcher | RegExp | string, resOptions?: ResOptions, mockOptions?: MockOptions) => void;
    mockRequestOnce: (matcher: Matcher | RegExp | string, resOptions?: ResOptions, mockOptions?: MockOptions) => void;
  };

  mockedFetch.mockDelete = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'delete' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementation(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockDeleteOnce = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'delete' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementationOnce(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockGet = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'get' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementation(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockGetOnce = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'get' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementationOnce(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockPost = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'post' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementation(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockPostOnce = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'post' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementationOnce(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockPut = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'put' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementation(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockPutOnce = (
    matcher: Omit<Matcher, 'method'> | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const normalisedMatcher = { ...normaliseMatcher(matcher), method: 'put' };
    const zodSchema = jsonToZod(normalisedMatcher);
    mockedFetch.mockImplementationOnce(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockRequest = (
    matcher: Matcher | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const zodSchema = jsonToZod(normaliseMatcher(matcher));
    mockedFetch.mockImplementation(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockRequestOnce = (
    matcher: Matcher | RegExp | string,
    resOptions?: ResOptions,
    mockOptions?: MockOptions
  ) => {
    const zodSchema = jsonToZod(normaliseMatcher(matcher));
    mockedFetch.mockImplementationOnce(createMockImplementation(zodSchema, resOptions, mockOptions));
  };

  mockedFetch.mockRestore = () => {
    globalThis.fetch = globalFetch;
  };

  return mockedFetch;
};
