import Validator from '../validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerNormalizer('toInt', (value: any, params: { radix?: number }) => {
  if (isString(value) || (isNumber(value) && value !== Infinity)) {
    return parseInt(`${value}`, params.radix || 10);
  }

  return value;
});
