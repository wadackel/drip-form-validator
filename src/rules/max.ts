import Validator from '../validator';
import { isString, isNumber, isArray } from '../internal/utils';

Validator.registerRule('max', {}, (value: any, { max }: { max: number }) => {
  if (isString(value) || isArray(value)) {
    return value.length <= max;
  } else if (isNumber(value)) {
    return value <= max;
  } else {
    return false;
  }
});
