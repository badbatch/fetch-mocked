import { isPlainObject, isString } from 'lodash-es';
import type { Jsonifiable } from 'type-fest';

const isBodyValidArray = (body: Jsonifiable): body is [string, string][] =>
  Array.isArray(body) &&
  body.every(entry => Array.isArray(entry) && entry.length === 2 && entry.every(subEntry => isString(subEntry)));

const isBodyValidObj = (body: Jsonifiable): body is Record<string, string> =>
  !!body && isPlainObject(body) && Object.entries(body).every(subEntry => isString(subEntry));

export const appendFormData = (formData: FormData, body: Jsonifiable) => {
  if (isBodyValidArray(body)) {
    for (const [key, value] of body) {
      formData.append(key, value);
    }
  } else if (isBodyValidObj(body)) {
    for (const [key, value] of Object.entries(body)) {
      formData.append(key, value);
    }
  }

  return formData;
};
