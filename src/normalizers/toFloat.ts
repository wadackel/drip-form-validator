import Validator from '../validator';
import { isString } from '../internal/utils';

Validator.registerNormalizer('toFloat', (value: any) => {
  return isString(value) ? parseFloat(value) : value;
});
