import { isPlainObject } from 'lodash-es';
import type { Matcher } from '../types.ts';

export const isMatcher = (value: Matcher | RegExp | string): value is Matcher => isPlainObject(value);
