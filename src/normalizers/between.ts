import Validator from '../validator';
import { isNumeric } from '../internal/utils';

Validator.registerNormalizer('between', {}, (value: any, { min, max }: { min: number, max: number }) => {
  if (isNumeric(value)) {
    return Math.min(Math.max(parseFloat(<any>value), min), max);
  }

  return value;
});
