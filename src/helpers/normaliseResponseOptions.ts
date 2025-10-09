import { isNumber, isString } from 'lodash-es';
import { type ResponseOptions, type ResponseOptionsFunc, type ResponseOptionsObj } from '../types/index.ts';

export const normaliseResponseOptions = (
  resOptions?: ResponseOptions,
): ResponseOptionsFunc | ResponseOptionsObj | undefined =>
  isNumber(resOptions) ? { status: resOptions } : isString(resOptions) ? { body: resOptions } : resOptions;
