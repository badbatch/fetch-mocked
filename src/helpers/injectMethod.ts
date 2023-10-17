import { isFunction } from 'lodash-es';
import type { FetchMethod, MatcherFunc, MatcherObj } from '../types.ts';

export const injectMethod = (matcher: MatcherFunc | MatcherObj, method: FetchMethod) => {
  if (isFunction(matcher)) {
    return matcher;
  }

  return { ...matcher, method };
};
