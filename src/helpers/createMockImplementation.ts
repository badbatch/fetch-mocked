import type { ZodObject, ZodTypeAny } from 'zod';
import type { MockOptions, ResOptions } from '../types.ts';
import { isSchemaValid } from './isSchemaValid.ts';
import { normaliseRequest } from './normaliseRequest.ts';

export const createMockImplementation = (
  zodSchema: ZodObject<Record<string, ZodTypeAny>>,
  resOptions?: ResOptions,
  mockOptions?: MockOptions
) => {
  const { body, headers = {}, status = 200, statusText = 'OK' } = resOptions ?? {};
  const { delay } = mockOptions ?? {};

  return (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => {
    const normalisedRequest = normaliseRequest(requestInfo, requestInit);

    if (isSchemaValid(zodSchema, normalisedRequest)) {
      if (delay) {
        return new Promise<Response>(resolve =>
          setTimeout(() => {
            resolve(new Response(body ? JSON.stringify(body) : undefined, { headers, status, statusText }));
          }, delay)
        );
      }

      return Promise.resolve(new Response(body ? JSON.stringify(body) : undefined, { headers, status, statusText }));
    }

    throw new Error('fetch mock: the request was not covered by any of the matchers');
  };
};
