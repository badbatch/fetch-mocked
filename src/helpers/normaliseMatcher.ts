import type { Matcher } from '../types.ts';
import { isMatcher } from './isMatcher.ts';

export const normaliseMatcher = (matcher: Matcher | RegExp | string): Matcher =>
  isMatcher(matcher) ? matcher : { url: matcher };
