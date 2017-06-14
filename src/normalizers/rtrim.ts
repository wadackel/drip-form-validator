import rtrim = require('validator/lib/rtrim');
import Validator from '../validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerNormalizer('rtrim', (value: any, chars: string | boolean) => {
  if (!isString(value) && !isNumber(value)) {
    return value;
  }

  return rtrim(`${value}`, isString(chars) ? chars : undefined);
});
