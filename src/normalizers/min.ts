import Validator from '../Validator';
import { isNumeric } from '../internal/utils';

Validator.registerNormalizer('min', (value: any, min: number) => {
  if (isNumeric(value)) {
    return Math.max(parseFloat(<any>value), min);
  }

  return value;
});
