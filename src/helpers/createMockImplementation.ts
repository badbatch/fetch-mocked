import { isFunction, merge } from 'lodash-es';
import {
  type MatcherFunc,
  type MatcherZod,
  type MockFetchOptions,
  type MockOptions,
  type ResponseOptions,
  ResponseType,
} from '../types.ts';
import { addContentType } from './addContentType.ts';
import { isSchemaValid } from './isSchemaValid.ts';
import { normaliseHeaders, normaliseRequest } from './normaliseRequest.ts';
import { serialiseBody } from './serialiseBody.ts';

export const createMockImplementation = (
  matcher: MatcherFunc | MatcherZod,
  mockFetchOptions: MockFetchOptions & {
    globalFetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;
  },
  resOptions?: ResponseOptions,
  mockOptions?: MockOptions
) => {
  const {
    delay,
    fallbackHandler,
    fallbackToNetwork = false,
    globalFetch,
    responseType = ResponseType.JSON,
    warnOnFallback = false,
  } = merge({}, mockFetchOptions, mockOptions ?? {});

  const { body, headers = {}, status = 200, statusText } = resOptions ?? {};
  const serialisedResponseBody = body ? serialiseBody(body, responseType) : undefined;
  const responseHeadersWithDefaults = addContentType(normaliseHeaders(headers)!, responseType);
  const statusTextWithDefault = !statusText && status === 200 ? 'OK' : statusText;

  return (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => {
    const normalisedRequest = normaliseRequest(requestInfo, requestInit);
    const isMatch = isFunction(matcher) ? matcher(requestInfo, requestInit) : isSchemaValid(matcher, normalisedRequest);

    if (isMatch) {
      const response = new Response(serialisedResponseBody, {
        headers: responseHeadersWithDefaults,
        status,
        statusText: statusTextWithDefault,
      });

      if (delay) {
        return new Promise<Response>(resolve =>
          setTimeout(() => {
            resolve(response);
          }, delay)
        );
      }

      return Promise.resolve(response);
    }

    if (isFunction(fallbackHandler)) {
      fallbackHandler({
        finalResponseOptions: {
          body: serialisedResponseBody,
          headers: responseHeadersWithDefaults,
          status,
          statusText: statusTextWithDefault,
        },
        initialResponseOptions: {
          body,
          headers,
          status,
          statusText,
        },
        matcher,
        mockOptions: {
          delay,
          fallbackToNetwork,
          responseType,
          warnOnFallback,
        },
        normalisedRequest,
        requestInfo,
        requestInit,
      });
    }

    if (!fallbackToNetwork) {
      const message = `fetch-mocked => the ${normalisedRequest.method} request to ${normalisedRequest.url} was not covered by any of the matchers.`;
      console.error(message, { normalisedRequest });
      throw new Error(message);
    }

    if (warnOnFallback) {
      console.warn(
        `fetch-mocked => the ${normalisedRequest.method} request to ${normalisedRequest.url} was not covered by any of the matchers, falling back to network.`,
        { normalisedRequest }
      );
    }

    return globalFetch(requestInfo, requestInit);
  };
};
