import { isFunction } from 'lodash-es';
import { createCounter } from './helpers/createCounter.ts';
import { createMockImplementation } from './helpers/createMockImplementation.ts';
import { injectMethod } from './helpers/injectMethod.ts';
import { mockClearLastCall } from './helpers/mockClearLastCall.ts';
import { normaliseMatcherObj } from './helpers/normaliseMatcherObj.ts';
import { normaliseMethod, normaliseUrl } from './helpers/normaliseRequest.ts';
import { normaliseResponseOptions } from './helpers/normaliseResponseOptions.ts';
import { transformMatcherObjToZod } from './helpers/transformMatcherObjToZod.ts';
import {
  type ImplicitMethodMatcher,
  type Matcher,
  type MockFetch,
  type MockFetchOptions,
  type MockImplementation,
  type MockOptions,
  type ResponseOptions,
} from './types/index.ts';

const globalFetch = fetch;
export let activeMocks: [MockImplementation, { limit: number; total: number }][] = [];

export const mockFetch = <T extends () => unknown>(mockFunc: T, mockFetchOptions?: MockFetchOptions): MockFetch => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, unicorn/no-global-object-property-assignment
  const mockedFetch = (globalThis.fetch = new Proxy(mockFunc() as MockFetch, {
    get: (obj, prop: keyof MockFetch): MockFetch[keyof MockFetch] => {
      if (prop === 'mockReset') {
        activeMocks = [];
      }

      return obj[prop];
    },
  }));

  const {
    fallbackHandler,
    fallbackToNetwork = false,
    responseType = 'json',
    warnOnFallback = false,
  } = mockFetchOptions ?? {};

  const mockImplementation = async (requestInfo: RequestInfo | URL, requestInit?: RequestInit): Promise<Response> => {
    return new Promise((resolve, reject) => {
      let settled = false;

      const cleanup = (): void => {
        requestInit?.signal?.removeEventListener('abort', onAbort);
      };

      const onAbort = (): void => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        const error = new Error('The operation was aborted.');
        // eslint-disable-next-line unicorn/no-error-property-assignment
        error.name = 'AbortError';
        reject(error);
      };

      if (requestInit?.signal?.aborted) {
        onAbort();
        return;
      }

      requestInit?.signal?.addEventListener('abort', onAbort);

      let mockImpResolve: (() => Promise<Response>) | undefined;

      const index = activeMocks.findIndex(([mockImp]) => {
        const result = mockImp(requestInfo, requestInit);

        if (result.isMatch) {
          mockImpResolve = result.resolve;
        }

        return result.isMatch;
      });

      const settleWith = (promise: Promise<Response>): void => {
        void promise
          // In this situation I'd rather leave this
          // eslint-disable-next-line unicorn/prefer-await
          .then(res => {
            if (settled) {
              return;
            }

            settled = true;
            cleanup();
            resolve(res);
          })
          // In this situation I'd rather leave this
          // eslint-disable-next-line unicorn/prefer-await
          .catch((error: unknown) => {
            if (settled) {
              return;
            }

            settled = true;
            cleanup();
            reject(error instanceof Error ? error : new Error('Failed to resolve mock implementation.'));
          });
      };

      if (index !== -1 && mockImpResolve) {
        // In this context activeMocks[index] will not be undefined.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const [, counter] = activeMocks[index]!;
        counter.total += 1;

        if (counter.total === counter.limit) {
          activeMocks.splice(index, 1);
        }

        settleWith(mockImpResolve());
        return;
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
        reject(
          new Error(
            `fetch-mocked => the ${normaliseMethod(requestInit)} request to ${normaliseUrl(
              requestInfo,
            )} was not covered by any of the matchers.`,
          ),
        );

        return;
      }

      if (warnOnFallback) {
        console.warn(
          `fetch-mocked => the ${normaliseMethod(requestInit)} request to ${normaliseUrl(
            requestInfo,
          )} was not covered by any of the matchers, falling back to network.`,
        );
      }

      settleWith(globalFetch(requestInfo, requestInit));
    });
  };

  const applyMockImplementation = (): void => {
    if (mockedFetch.getMockImplementation() === mockImplementation) {
      return;
    }

    mockedFetch.mockImplementation(mockImplementation);
  };

  mockedFetch.mockDelete = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'delete'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockDeleteOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'delete'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockGet = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'get'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockGetOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'get'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPost = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'post'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPostOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'post'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPut = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'put'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockPutOnce = (
    matcher: ImplicitMethodMatcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(injectMethod(normaliseMatcherObj(matcher), 'put'));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockRequest = (matcher: Matcher, resOptions?: ResponseOptions, mockOptions?: MockOptions): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(normaliseMatcherObj(matcher));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(mockOptions?.times),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockRequestOnce = (
    matcher: Matcher,
    resOptions?: ResponseOptions,
    mockOptions?: MockOptions,
  ): MockFetch => {
    applyMockImplementation();
    const zodObj = transformMatcherObjToZod(normaliseMatcherObj(matcher));

    activeMocks.push([
      createMockImplementation(zodObj, normaliseResponseOptions(resOptions), mockOptions),
      createCounter(1),
    ]);

    return mockedFetch;
  };

  mockedFetch.mockRestore = (): void => {
    // This is intended
    // eslint-disable-next-line unicorn/no-global-object-property-assignment
    globalThis.fetch = globalFetch;
  };

  return mockedFetch;
};
