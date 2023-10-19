import { isRegExp } from 'lodash-es';
import type { JsonArray, JsonObject, ValueOf } from 'type-fest';
import { type ZodTypeAny, z } from 'zod';
import type { MatcherObj } from '../types.ts';
import { areArrayEntriesSameType } from './areArrayEntriesSameType.ts';

const IS_REGEX = /^\/.+\/[dgimsuvy]*$/;

const typeofToZodType = (value: ValueOf<MatcherObj>): ZodTypeAny => {
  switch (true) {
    case isRegExp(value): {
      const castValue = value as RegExp;
      return z.string().regex(castValue);
    }

    case typeof value === 'string': {
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

    case typeof value === 'number': {
      const castValue = value as number;
      return z.literal(castValue);
    }

    case typeof value === 'boolean': {
      const castValue = value as unknown as boolean;
      return z.literal(castValue);
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

    case typeof value === 'object' && !Array.isArray(value): {
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
      return z.unknown();
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
