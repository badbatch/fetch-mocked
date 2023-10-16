import { isRegExp } from 'lodash-es';
import type { JsonArray, JsonObject, ValueOf } from 'type-fest';
import { type ZodTypeAny, z } from 'zod';
import type { Matcher } from '../types.ts';

const IS_REGEX = /^\/.+\/[dgimsuvy]*$/;

const typeofToZodType = (value: ValueOf<Matcher>) => {
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
        return z.string().startsWith(castValue.slice(1));
      }

      if (castValue.endsWith('*')) {
        return z.string().endsWith(castValue.slice(0, -1));
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

      return z.object(
        // eslint-disable-next-line unicorn/no-array-reduce
        Object.keys(castValue).reduce((acc: Record<string, ZodTypeAny>, key) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const zodType = typeofToZodType(castValue[Number(key)]);

          if (zodType) {
            acc[key] = zodType;
          }

          return acc;
        }, {})
      );
    }

    case typeof value === 'object' && !Array.isArray(value): {
      const castValue = value as JsonObject;

      return z.object(
        // eslint-disable-next-line unicorn/no-array-reduce
        Object.keys(castValue).reduce((acc: Record<string, ZodTypeAny>, key) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const zodType = typeofToZodType(castValue[key]);

          if (zodType) {
            acc[key] = zodType;
          }

          return acc;
        }, {})
      );
    }

    default: {
      return;
    }
  }
};

export const jsonToZod = (matcher: Matcher) =>
  z.object(
    // eslint-disable-next-line unicorn/no-array-reduce
    Object.keys(matcher).reduce((acc: Record<string, ZodTypeAny>, key) => {
      const zodType = typeofToZodType(matcher[key as keyof Matcher]);

      if (zodType) {
        acc[key] = zodType;
      }

      return acc;
    }, {})
  );
