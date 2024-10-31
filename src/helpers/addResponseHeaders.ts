import { flow } from 'lodash-es';
// vitest cannot handle inline type specifiers from type-only packages.
// eslint-disable-next-line import-x/consistent-type-specifier-style
import type { Jsonifiable } from 'type-fest';
import { type ResponseType } from '../enums.ts';
import { addContentLength } from './addContentLength.ts';
import { addContentType } from './addContentType.ts';

export const addResponseHeaders = (
  body: Jsonifiable | undefined,
  headers: Record<string, string>,
  responseType: ResponseType,
  // Problematic typing return value.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
) => flow([addContentType(responseType), addContentLength(body)])(headers) as Record<string, string>;
