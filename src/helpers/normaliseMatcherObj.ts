import { isFunction } from 'lodash-es';
import { type Matcher, type MatcherObj } from '../types/index.ts';
import { isMatcherObj } from './isMatcherObj.ts';

export const normaliseHeaders = (headers: Exclude<MatcherObj['headers'], undefined>) => {
  return Object.keys(headers).reduce<Exclude<MatcherObj['headers'], undefined>>((acc, headerName) => {
    // typescript not inferring headers[headerName] cannot be undefined.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return { ...acc, [headerName.toLowerCase()]: headers[headerName]! };
  }, {});
};

export const normaliseMethod = (method: string) => method.toLowerCase();

export const normaliseMatcherObj = (matcher: Matcher) => {
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
