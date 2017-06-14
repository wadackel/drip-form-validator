import Validator from '../validator';
import { hasProp, isNumeric } from '../internal/utils';

Validator.registerNormalizer('minWith', (value: any, key: string, _: any, values: any) => {
  if (hasProp(values, key) && isNumeric(values[key]) && isNumeric(value)) {
    return Math.max(parseFloat(<any>values[key]), parseFloat(<any>value));
  }

  return value;
});
