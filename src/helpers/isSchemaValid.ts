import type { ZodObject, ZodRawShape } from 'zod';
import type { NormalisedRequest } from '../types/index.ts';

export const isSchemaValid = (zodSchema: ZodObject<ZodRawShape>, request: NormalisedRequest) => {
  try {
    zodSchema.parse(request);
    return true;
  } catch {
    return false;
  }
};
