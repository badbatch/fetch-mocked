import { isFunction } from 'lodash-es';
import type { Matcher } from '../types.ts';
import { isMatcherObj } from './isMatcherObj.ts';

export const normaliseMatcherObj = (matcher: Matcher) => {
  if (isFunction(matcher)) {
    return matcher;
  }

  return isMatcherObj(matcher) ? matcher : { url: matcher };
};
