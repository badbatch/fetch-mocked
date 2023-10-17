import { createMockImplementation } from './helpers/createMockImplementation.ts';
import { injectMethod } from './helpers/injectMethod.ts';
import { normaliseMatcherObj } from './helpers/normaliseMatcherObj.ts';
import { normaliseRequestOptions } from './helpers/normaliseRequestOptions.ts';
import { transformMatcherObjToZod } from './helpers/transformMatcherObjToZod.ts';
import type {
  ImplicitMethodMatcher,
  Matcher,
  MockFetch,
  MockFetchOptions,
  MockFunc,
  MockOptions,
  ResponseOptions,
} from './types.ts';

const globalFetch = globalThis.fetch;

export const mockFetch = (mockFunc: () => MockFunc, mockFetchOptions?: MockFetchOptions) => {
  globalThis.fetch = mockFunc();

  const mockedFetch = globalThis.fetch as MockFetch;

  mockedFetch.mockDelete = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementation(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'delete')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockDeleteOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementationOnce(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'delete')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockGet = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementation(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'get')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockGetOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementationOnce(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'get')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockPost = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementation(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'post')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockPostOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementationOnce(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'post')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockPut = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementation(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'put')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockPutOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementationOnce(
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'put')),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockRequest = (matcher: Matcher, resOptions?: ResponseOptions | number, mockOptions?: MockOptions) => {
    mockedFetch.mockImplementation(
      createMockImplementation(
        transformMatcherObjToZod(normaliseMatcherObj(matcher)),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockRequestOnce = (
    matcher: Matcher,
    resOptions?: ResponseOptions | number,
    mockOptions?: MockOptions
  ) => {
    mockedFetch.mockImplementationOnce(
      createMockImplementation(
        transformMatcherObjToZod(normaliseMatcherObj(matcher)),
        { ...mockFetchOptions, globalFetch },
        normaliseRequestOptions(resOptions),
        mockOptions
      )
    );

    return mockedFetch;
  };

  mockedFetch.mockRestore = () => {
    globalThis.fetch = globalFetch;
  };

  return mockedFetch;
};
