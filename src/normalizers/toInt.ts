import Validator from '../validator';
import { isString } from '../internal/utils';

Validator.registerNormalizer('toInt', {}, (value: any, params: { radix?: number }) => {
  if (!isString(value)) {
    return value;
  }

  return parseInt(value, params.radix || 10);
});
