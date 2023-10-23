import { isBoolean, isFunction, isNumber, isPlainObject, isRegExp, isString } from 'lodash-es';
import type { JsonArray, JsonObject, Jsonifiable } from 'type-fest';
import { type ZodTypeAny, z } from 'zod';
import type { MatcherObj, MatcherRecursiveObj, MatcherValueFunc } from '../types.ts';
import { areArrayEntriesSameType } from './areArrayEntriesSameType.ts';

const IS_REGEX = /^\/.+\/[dgimsuvy]*$/;

const typeofToZodType = (value?: Jsonifiable | RegExp | MatcherValueFunc | MatcherRecursiveObj): ZodTypeAny => {
  switch (true) {
    case isRegExp(value): {
      const castValue = value as RegExp;
      return z.string().regex(castValue);
    }

    case isString(value): {
      const castValue = value as string;

      if (castValue === '*') {
        return z.string();
      }

      if (castValue.startsWith('*')) {
        return z.string().endsWith(castValue.slice(1));
      }

      if (castValue.endsWith('*')) {
        return z.string().startsWith(castValue.slice(0, -1));
      }

      if (IS_REGEX.test(castValue)) {
        return z.string().regex(new RegExp(castValue.slice(1, -1)));
      }

      return z.literal(castValue);
    }

    case isNumber(value): {
      const castValue = value as number;
      return z.literal(castValue);
    }

    case isBoolean(value): {
      const castValue = value as boolean;
      return z.literal(castValue);
    }

    case isFunction(value): {
      const castValue = value as MatcherValueFunc;
      return z.custom(castValue);
    }

    case Array.isArray(value): {
      const castValue = value as JsonArray;

      if (areArrayEntriesSameType(castValue)) {
        return z.array(typeofToZodType(castValue[0]));
      } else {
        const zodTypes = castValue.map(entry => typeofToZodType(entry)) as [ZodTypeAny, ...ZodTypeAny[]];
        return z.tuple(zodTypes);
      }
    }

    case isPlainObject(value): {
      const castValue = value as JsonObject;

      return z.object(
        // eslint-disable-next-line unicorn/no-array-reduce
        Object.keys(castValue).reduce((acc: Record<string, ZodTypeAny>, key) => {
          acc[key] = typeofToZodType(castValue[key]);

          return acc;
        }, {})
      );
    }

    default: {
      return z.any();
    }
  }
};

export const jsonToZod = (matcher: MatcherObj) =>
  z.object(
    // eslint-disable-next-line unicorn/no-array-reduce
    Object.keys(matcher).reduce((acc: Record<string, ZodTypeAny>, key) => {
      acc[key] = typeofToZodType(matcher[key as keyof MatcherObj]);
      return acc;
    }, {})
  );
