import trim = require('validator/lib/trim');
import Validator from '../validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerNormalizer('trim', {}, (value: any, params: { chars?: string }) => {
  if (!isString(value) && !isNumber(value)) {
    return value;
  }

  return trim(`${value}`, params.chars);
});
