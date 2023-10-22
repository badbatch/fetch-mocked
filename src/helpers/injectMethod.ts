import { isFunction } from 'lodash-es';
import type { MatcherFunc, MatcherObj } from '../types.ts';

export const injectMethod = (matcher: MatcherFunc | MatcherObj, method: string) => {
  if (isFunction(matcher)) {
    return matcher;
  }

  return { ...matcher, method };
};
