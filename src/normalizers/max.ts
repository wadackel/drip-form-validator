import Validator from '../Validator';
import { isNumeric } from '../internal/utils';

Validator.registerNormalizer('max', (value: any, max: number) => {
  if (value === Infinity) {
    return max;
  } else if (isNumeric(value)) {
    return Math.min(parseFloat(<any>value), max);
  }

  return value;
});
