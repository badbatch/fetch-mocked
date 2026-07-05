import { isBoolean, isNumber, isObjectLike, isRegExp, isString, isUndefined } from 'lodash-es';
// vitest cannot handle inline type specifiers from type-only packages.
// eslint-disable-next-line import-x/consistent-type-specifier-style
import type { JsonArray, JsonValue } from 'type-fest';

export type EntryType = 'array' | 'regexp' | 'boolean' | 'number' | 'object' | 'string';

const getEntryType = (value: JsonValue): EntryType | undefined => {
  switch (true) {
    case Array.isArray(value): {
      return 'array';
    }

    case isRegExp(value): {
      return 'regexp';
    }

    case isBoolean(value): {
      return 'boolean';
    }

    case isNumber(value): {
      return 'number';
    }

    case isObjectLike(value): {
      return 'object';
    }

    case isString(value): {
      return 'string';
    }

    default: {
      return;
    }
  }
};

export const areArrayEntriesSameType = (value: JsonArray): boolean => {
  let arrayType: string | undefined;

  for (const entry of value) {
    const entryType = getEntryType(entry);

    if (entryType && isUndefined(arrayType)) {
      arrayType = entryType;
      continue;
    }

    if (entryType !== arrayType) {
      arrayType = '';
    }
  }

  return !!arrayType;
};
