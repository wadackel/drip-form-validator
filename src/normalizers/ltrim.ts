import ltrim = require('validator/lib/ltrim');
import Validator from '../validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerNormalizer('ltrim', {}, (value: any, params: { chars?: string }) => {
  if (!isString(value) && !isNumber(value)) {
    return value;
  }

  return ltrim(`${value}`, params.chars);
});
