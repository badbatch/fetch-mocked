import { isFunction } from 'lodash-es';
import { type Matcher, type MatcherFunc, type MatcherObj } from '../types/index.ts';
import { isMatcherObj } from './isMatcherObj.ts';

export type NormaliseHeaders = Exclude<MatcherObj['headers'], undefined>;

export const normaliseHeaders = (headers: NormaliseHeaders): NormaliseHeaders => {
  return Object.keys(headers).reduce<NormaliseHeaders>((acc, headerName) => {
    // TypeScript not inferring headers[headerName] cannot be undefined.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { ...acc, [headerName.toLowerCase()]: headers[headerName]! };
  }, {});
};

export const normaliseMethod = (method: string): string => method.toLowerCase();

export const normaliseMatcherObj = (matcher: Matcher): MatcherObj | MatcherFunc => {
  if (isFunction(matcher)) {
    return matcher;
  }

  const matcherObj = isMatcherObj(matcher) ? matcher : { url: matcher };

  if (matcherObj.headers) {
    matcherObj.headers = normaliseHeaders(matcherObj.headers);
  }

  if (matcherObj.method) {
    matcherObj.method = normaliseMethod(matcherObj.method);
  }

  return matcherObj;
};
