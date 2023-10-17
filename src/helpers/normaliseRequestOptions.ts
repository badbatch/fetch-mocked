import { isNumber } from 'lodash-es';
import type { ResponseOptions } from '../types.ts';

export const normaliseRequestOptions = (resOptions?: ResponseOptions | number) =>
  isNumber(resOptions) ? { status: resOptions } : resOptions;
