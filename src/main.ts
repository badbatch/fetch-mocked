import { isFunction } from 'lodash-es';
import { ResponseType } from './enums.ts';
import { createCounter } from './helpers/createCounter.ts';
import { createMockImplementation } from './helpers/createMockImplementation.ts';
import { injectMethod } from './helpers/injectMethod.ts';
import { mockClearLastCall } from './helpers/mockClearLastCall.ts';
import { normaliseMatcherObj } from './helpers/normaliseMatcherObj.ts';
import { normaliseMethod, normaliseUrl } from './helpers/normaliseRequest.ts';
import { normaliseRequestOptions } from './helpers/normaliseRequestOptions.ts';
import { transformMatcherObjToZod } from './helpers/transformMatcherObjToZod.ts';
import {
  type ImplicitMethodMatcher,
  type Matcher,
  type MockFetch,
  type MockFetchOptions,
  type MockFunc,
  type MockImplementation,
  type MockOptions,
  type ResponseOptions,
} from './types.ts';

const globalFetch = globalThis.fetch;
export let activeMocks: [MockImplementation, { limit: number; total: number }][] = [];

export const mockFetch = (mockFunc: () => MockFunc, mockFetchOptions?: MockFetchOptions) => {
  const mockedFetch = (globalThis.fetch = new Proxy(mockFunc() as MockFetch, {
    get(obj, prop: keyof MockFetch) {
      if (prop === 'mockReset') {
        activeMocks = [];
      }

      return obj[prop];
    },
  }));

  const {
    fallbackHandler,
    fallbackToNetwork = false,
    responseType = ResponseType.JSON,
    warnOnFallback = false,
  } = mockFetchOptions ?? {};

  const mockImplementation = async (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => {
    const index = activeMocks.findIndex(([mockImp]) => mockImp(requestInfo, requestInit).isMatch);

    if (index !== -1) {
      const [mockImp, counter] = activeMocks[index]!;
      counter.total += 1;

      if (counter.total === counter.limit) {
        activeMocks.splice(index, 1);
      }

      return mockImp(requestInfo, requestInit).resolve();
    }

    mockClearLastCall(mockedFetch);

    if (isFunction(fallbackHandler)) {
      fallbackHandler({
        mockOptions: {
          fallbackToNetwork,
          responseType,
          warnOnFallback,
        },
        requestInfo,
        requestInit,
      });
    }

    if (!fallbackToNetwork) {
      throw new Error(
        `fetch-mocked => the ${normaliseMethod(requestInit)} request to ${normaliseUrl(
          requestInfo
        )} was not covered by any of the matchers.`
      );
    }

    if (warnOnFallback) {
      console.warn(
        `fetch-mocked => the ${normaliseMethod(requestInit)} request to ${normaliseUrl(
          requestInfo
        )} was not covered by any of the matchers, falling back to network.`
      );
    }

    return globalFetch(requestInfo, requestInit);
  };

  const applyMockImplementation = () => {
    if (mockedFetch.getMockImplementation() === mockImplementation) {
      return;
    }

    mockedFetch.mockImplementation(mockImplementation);
  };

  mockedFetch.mockDelete = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions
  ) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'delete')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockDeleteOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions
  ) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'delete')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockGet = (matcher: ImplicitMethodMatcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'get')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockGetOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions
  ) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'get')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPost = (matcher: ImplicitMethodMatcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'post')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPostOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions
  ) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'post')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPut = (matcher: ImplicitMethodMatcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'put')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPutOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions
  ) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'put')),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockRequest = (matcher: Matcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(normaliseMatcherObj(matcher)),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockRequestOnce = (matcher: Matcher, resOptions?: ResponseOptions, mockOptions?: MockOptions) => {
    applyMockImplementation();

    activeMocks.push([
      createMockImplementation(
        transformMatcherObjToZod(normaliseMatcherObj(matcher)),
        normaliseRequestOptions(resOptions),
        mockOptions
      ),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockRestore = () => {
    globalThis.fetch = globalFetch;
  };

  return mockedFetch;
};
