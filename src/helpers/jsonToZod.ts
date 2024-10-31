import { isBoolean, isFunction, isNumber, isPlainObject, isRegExp, isString } from 'lodash-es';
// vitest cannot handle inline type specifiers from type-only packages.
// eslint-disable-next-line import-x/consistent-type-specifier-style
import type { JsonArray, JsonObject, Jsonifiable } from 'type-fest';
import { type ZodTypeAny, z } from 'zod';
import { type MatcherObj, type MatcherRecursiveObj, type MatcherValueFunc } from '../types/index.ts';
import { areArrayEntriesSameType } from './areArrayEntriesSameType.ts';

const IS_REGEX = /^\/.+\/[dgimsuvy]*$/;
const isArray = (value: unknown): value is JsonArray => Array.isArray(value);
const isObject = (value: unknown): value is JsonObject => isPlainObject(value);

const typeofToZodType = (value?: Jsonifiable | RegExp | MatcherValueFunc | MatcherRecursiveObj): ZodTypeAny => {
  switch (true) {
    case isRegExp(value): {
      return z.string().regex(value);
    }

    case isString(value): {
      if (value === '*') {
        return z.string();
      }

      if (value.startsWith('*')) {
        return z.string().endsWith(value.slice(1));
      }

      if (value.endsWith('*')) {
        return z.string().startsWith(value.slice(0, -1));
      }

      if (IS_REGEX.test(value)) {
        return z.string().regex(new RegExp(value.slice(1, -1)));
      }

      return z.literal(value);
    }

    case isNumber(value): {
      return z.literal(value);
    }

    case isBoolean(value): {
      return z.literal(value);
    }

    case isFunction(value): {
      return z.custom(value);
    }

    case isArray(value): {
      if (areArrayEntriesSameType(value)) {
        return z.array(typeofToZodType(value[0]));
      } else {
        // Need to force to tuple type as typescript not inferring.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const zodTypes = value.map(entry => typeofToZodType(entry)) as [ZodTypeAny, ...ZodTypeAny[]];
        return z.tuple(zodTypes);
      }
    }

    case isObject(value): {
      return z.object(
        Object.keys(value).reduce((acc: Record<string, ZodTypeAny>, key) => {
          acc[key] = typeofToZodType(value[key]);

          return acc;
        }, {}),
      );
    }

    default: {
      return z.any();
    }
  }
};

export const jsonToZod = (matcher: MatcherObj) =>
  z.object(
    Object.keys(matcher).reduce((acc: Record<string, ZodTypeAny>, key) => {
      // typescript not inferring key is a key of MatcherObj.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      acc[key] = typeofToZodType(matcher[key as keyof MatcherObj]);
      return acc;
    }, {}),
  );
