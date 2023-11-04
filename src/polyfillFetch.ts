import fetch, { Headers, Request, Response } from 'node-fetch';

export const polyfillFetch = () => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!globalThis.fetch) {
    // @ts-expect-error polyfill missing properties
    globalThis.fetch = fetch;
    // @ts-expect-error polyfill missing properties
    globalThis.Headers = Headers;
    // @ts-expect-error polyfill missing properties
    globalThis.Request = Request;
    // @ts-expect-error polyfill missing properties
    globalThis.Response = Response;
  }
};
