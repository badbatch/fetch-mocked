import { isString } from 'lodash-es';
import type { Jsonifiable } from 'type-fest';
import { ResponseType } from '../enums.ts';
import { appendFormData } from './appendFormData.ts';

export const serialiseBody = (body: Jsonifiable, responseType: ResponseType) => {
  switch (responseType) {
    case ResponseType.ARRAY_BUFFER: {
      return new TextEncoder().encode(JSON.stringify(body));
    }

    case ResponseType.BLOB: {
      return new Blob([JSON.stringify(body)]);
    }

    case ResponseType.FORM_DATA: {
      return appendFormData(new FormData(), body);
    }

    case ResponseType.JSON: {
      return JSON.stringify(body);
    }

    case ResponseType.TEXT: {
      return isString(body) ? body : body?.toString();
    }
  }
};
