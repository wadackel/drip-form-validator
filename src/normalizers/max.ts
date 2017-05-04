import Validator from '../validator';
import { isNumber } from '../internal/utils';

Validator.registerNormalizer('max', { toFloat: { radix: 10 } }, (value: any, { max }: { max: number }) => {
  if (!isNumber(value) || isNaN(value)) {
    return value;
  }

  return Math.min(value, max);
});
