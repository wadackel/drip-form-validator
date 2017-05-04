import Validator from '../validator';
import { isNumber } from '../internal/utils';

Validator.registerNormalizer('between', { toFloat: { radix: 10 } }, (value: any, { min, max }: { min: number, max: number }) => {
  if (!isNumber(value) || isNaN(value)) {
    return value;
  }

  return Math.min(Math.max(value, min), max);
});
