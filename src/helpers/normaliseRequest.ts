import { isString } from 'lodash-es';
// vitest cannot handle inline type specifiers from type-only packages.
// eslint-disable-next-line import-x/consistent-type-specifier-style
import type { Jsonifiable } from 'type-fest';

export const normaliseBody = (body?: BodyInit | null) => {
  if (!isString(body)) {
    return body;
  }

  try {
    // JSON.parse returns an any type.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return JSON.parse(body) as Jsonifiable;
  } catch {
    return body;
  }
};

export const normaliseHeaders = (headers?: HeadersInit) => {
  if (!headers) {
    return {};
  }

  if (headers instanceof Headers || Array.isArray(headers)) {
    const entries = headers instanceof Headers ? headers.entries() : headers;
    const normalisedHeaders: Record<string, string> = {};

    for (const [key, value] of entries) {
      normalisedHeaders[key.toLowerCase()] = value;
    }

    return normalisedHeaders;
  }

  return Object.keys(headers).reduce<Record<string, string>>((acc, headerName) => {
    // typescript not inferring headers[headerName] cannot be undefined.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { ...acc, [headerName.toLowerCase()]: headers[headerName]! };
  }, {});
};

export const normaliseMethod = (requestInit?: RequestInit) => requestInit?.method?.toLowerCase() ?? 'get';

export const normaliseUrl = (requestInfo: RequestInfo | URL) =>
  requestInfo instanceof URL ? requestInfo.href : requestInfo instanceof Request ? requestInfo.url : requestInfo;

export const normaliseRequest = (requestInfo: RequestInfo | URL, requestInit?: RequestInit) => ({
  body: normaliseBody(requestInit?.body),
  headers: normaliseHeaders(requestInit?.headers),
  method: normaliseMethod(requestInit),
  url: normaliseUrl(requestInfo),
});
