import { isString } from 'lodash-es';
import type { Jsonifiable } from 'type-fest';

export const normaliseBody = (body?: BodyInit | null) => {
  if (!isString(body)) {
    return body;
  }

  try {
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
