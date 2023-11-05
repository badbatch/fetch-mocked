import { flow } from 'lodash-es';
import type { Jsonifiable } from 'type-fest';
import type { ResponseType } from '../enums.ts';
import { addContentLength } from './addContentLength.ts';
import { addContentType } from './addContentType.ts';

export const addResponseHeaders = (
  body: Jsonifiable | undefined,
  headers: Record<string, string>,
  responseType: ResponseType
) => flow([addContentType(responseType), addContentLength(body)])(headers) as Record<string, string>;
