import { isString } from 'lodash-es';
// vitest cannot handle inline type specifiers from type-only packages.
// eslint-disable-next-line import-x/consistent-type-specifier-style
import type { Jsonifiable } from 'type-fest';
import { type ResponseType } from '../types/index.ts';
import { appendFormData } from './appendFormData.ts';

const stringifyBody = (body: Jsonifiable): string => {
  try {
    return JSON.stringify(body);
  } catch {
    if (isString(body)) {
      return body;
    }

    // Is okay in this instance
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    return body?.toString() ?? '';
  }
};

export const serialiseBody = (body: Jsonifiable, responseType: ResponseType): BodyInit | null | undefined => {
  switch (responseType) {
    case 'arraybuffer': {
      if (!isString(body)) {
        throw new Error('Expected the body passed into arraybuffer to be a string.');
      }

      const textEncoder = new TextEncoder();
      return textEncoder.encode(body);
    }

    case 'blob': {
      return new Blob([stringifyBody(body)]);
    }

    case 'formdata': {
      return appendFormData(new FormData(), body);
    }

    case 'json': {
      return JSON.stringify(body);
    }

    case 'text': {
      // Am okay with this instance
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return isString(body) ? body : (body?.toString() ?? '');
    }
  }
};
