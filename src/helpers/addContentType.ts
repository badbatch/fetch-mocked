import { ResponseType } from '../types.ts';

export const addContentType = (headers: Record<string, string>, responseType: ResponseType): Record<string, string> => {
  let contentType: string;

  switch (responseType) {
    case ResponseType.ARRAY_BUFFER: {
      contentType = 'application/octet-stream';
      break;
    }

    case ResponseType.BLOB: {
      contentType = 'application/octet-stream';
      break;
    }

    case ResponseType.FORM_DATA: {
      contentType = 'multipart/form-data';
      break;
    }

    case ResponseType.JSON: {
      contentType = 'application/json';
      break;
    }

    case ResponseType.TEXT: {
      contentType = 'text/plain';
      break;
    }
  }

  return { 'content-type': contentType, ...headers };
};
