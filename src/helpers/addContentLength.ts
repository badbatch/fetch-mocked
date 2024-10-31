// vitest cannot handle inline type specifiers from type-only packages.
// eslint-disable-next-line import-x/consistent-type-specifier-style
import type { Jsonifiable } from 'type-fest';

export const addContentLength =
  (body: Jsonifiable | undefined) =>
  (headers: Record<string, string>): Record<string, string> =>
    body ? { 'content-length': String(JSON.stringify(body).length), ...headers } : headers;
