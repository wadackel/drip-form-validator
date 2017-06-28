import trim = require('validator/lib/trim');
import Validator from '../Validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerNormalizer('trim', (value: any, chars: string | boolean) => {
  if (!isString(value) && !isNumber(value)) {
    return value;
  }

  return trim(`${value}`, isString(chars) ? chars : undefined);
});
