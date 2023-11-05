import { ResponseType } from '../enums.ts';

export const addContentType =
  (responseType: ResponseType) =>
  (headers: Record<string, string>): Record<string, string> => {
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
        contentType = 'application/x-www-form-urlencoded';
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
