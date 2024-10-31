import { isFunction } from 'lodash-es';
import { type MatcherFunc, type MatcherObj, type MatcherZod } from '../types/index.ts';
import { jsonToZod } from './jsonToZod.ts';

export const transformMatcherObjToZod = (matcher: MatcherFunc | MatcherObj): MatcherFunc | MatcherZod => {
  if (isFunction(matcher)) {
    return matcher;
  }

  return jsonToZod(matcher);
};
