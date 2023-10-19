import { isBoolean, isNumber, isObjectLike, isRegExp, isString, isUndefined } from 'lodash-es';
import type { JsonArray, JsonValue } from 'type-fest';

const getEntryType = (value: JsonValue) => {
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

export const areArrayEntriesSameType = (value: JsonArray) => {
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
