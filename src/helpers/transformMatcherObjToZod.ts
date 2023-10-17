import { isFunction } from 'lodash-es';
import type { MatcherFunc, MatcherObj, MatcherZod } from '../types.ts';
import { jsonToZod } from './jsonToZod.ts';

export const transformMatcherObjToZod = (matcher: MatcherFunc | MatcherObj): MatcherFunc | MatcherZod => {
  if (isFunction(matcher)) {
    return matcher;
  }

  return jsonToZod(matcher);
};
