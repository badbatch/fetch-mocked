import { type ResponseType } from '../types/index.ts';

export const addContentType =
  (responseType: ResponseType) =>
  (headers: Record<string, string>): Record<string, string> => {
    let contentType: string;

    switch (responseType) {
      case 'arraybuffer': {
        contentType = 'application/octet-stream';
        break;
      }

      case 'blob': {
        contentType = 'application/octet-stream';
        break;
      }

      case 'formdata': {
        contentType = 'application/x-www-form-urlencoded';
        break;
      }

      case 'json': {
        contentType = 'application/json';
        break;
      }

      case 'text': {
        contentType = 'text/plain';
        break;
      }
    }

    return { 'content-type': contentType, ...headers };
  };
