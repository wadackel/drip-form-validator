import Validator from '../validator';
import { isNumber } from '../internal/utils';

Validator.registerNormalizer('min', { toFloat: { radix: 10 } }, (value: any, { min }: { min: number }) => {
  if (!isNumber(value) || isNaN(value)) {
    return value;
  }

  return Math.max(value, min);
});
