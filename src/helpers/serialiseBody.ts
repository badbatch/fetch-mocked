import { isString } from 'lodash-es';
import type { Jsonifiable } from 'type-fest';
import { ResponseType } from '../enums.ts';
import { appendFormData } from './appendFormData.ts';

const stringifyBody = (body: Jsonifiable) => {
  try {
    return JSON.stringify(body);
  } catch {
    if (isString(body)) {
      return body;
    }

    // @ts-expect-error 'body' is possibly 'null'
    return body.toString();
  }
};

export const serialiseBody = (body: Jsonifiable, responseType: ResponseType) => {
  switch (responseType) {
    case ResponseType.ARRAY_BUFFER: {
      return new TextEncoder().encode(stringifyBody(body));
    }

    case ResponseType.BLOB: {
      return new Blob([stringifyBody(body)]);
    }

    case ResponseType.FORM_DATA: {
      return appendFormData(new FormData(), body);
    }

    case ResponseType.JSON: {
      return JSON.stringify(body);
    }

    case ResponseType.TEXT: {
      // @ts-expect-error 'body' is possibly 'null'
      return isString(body) ? body : body.toString();
    }
  }
};
