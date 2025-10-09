import { isFunction } from 'lodash-es';
import { ResponseType } from '../enums.ts';
import {
  type MatcherFunc,
  type MatcherZod,
  type MockOptions,
  type ResponseOptionsFunc,
  type ResponseOptionsObj,
} from '../types/index.ts';
import { addResponseHeaders } from './addResponseHeaders.ts';
import { isSchemaValid } from './isSchemaValid.ts';
import { normaliseHeaders, normaliseRequest } from './normaliseRequest.ts';
import { serialiseBody } from './serialiseBody.ts';

export const createMockImplementation = (
  matcher: MatcherFunc | MatcherZod,
  resOptions?: ResponseOptionsFunc | ResponseOptionsObj,
  mockOptions?: MockOptions,
) => {
  return (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => {
    const normalisedRequest = normaliseRequest(requestInfo, requestInit);
    const isMatch = isFunction(matcher) ? matcher(requestInfo, requestInit) : isSchemaValid(matcher, normalisedRequest);

    return {
      isMatch,
      resolve: isMatch
        ? async () => {
            const {
              body,
              headers,
              status = 200,
              statusText,
            } = isFunction(resOptions) ? resOptions(requestInfo, requestInit) : (resOptions ?? {});

            const { delay, responseType = ResponseType.JSON } = mockOptions ?? {};
            const serialisedResponseBody = body ? serialiseBody(body, responseType) : undefined;
            const responseHeadersWithDefaults = addResponseHeaders(body, normaliseHeaders(headers), responseType);
            const statusTextWithDefault = !statusText && status === 200 ? 'OK' : statusText;

            const response = new Response(serialisedResponseBody, {
              headers: responseHeadersWithDefaults,
              status,
              statusText: statusTextWithDefault,
            });

            if (delay) {
              return new Promise<Response>(resolve =>
                setTimeout(() => {
                  resolve(response);
                }, delay),
              );
            }

            return response;
          }
        : undefined,
    };
  };
};
