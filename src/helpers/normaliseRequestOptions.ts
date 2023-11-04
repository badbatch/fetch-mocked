import { isNumber, isString } from 'lodash-es';
import type { ResponseOptions, ResponseOptionsObj } from '../types/index.ts';

export const normaliseRequestOptions = (resOptions?: ResponseOptions): ResponseOptionsObj | undefined =>
  isNumber(resOptions) ? { status: resOptions } : isString(resOptions) ? { body: resOptions } : resOptions;
