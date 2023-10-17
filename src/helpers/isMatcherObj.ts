import { isPlainObject } from 'lodash-es';
import type { MatcherObj } from '../types.ts';

export const isMatcherObj = (value: MatcherObj | RegExp | string): value is MatcherObj => isPlainObject(value);
