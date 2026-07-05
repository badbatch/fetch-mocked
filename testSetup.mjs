import fetch, { Headers, Request, Response } from 'node-fetch';

if (!globalThis.fetch) {
  /* eslint-disable unicorn/no-global-object-property-assignment */
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
  /* eslint-enable unicorn/no-global-object-property-assignment */
}
