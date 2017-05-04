import Validator from '../validator';
import { isString, isNumber, isArray } from '../internal/utils';

Validator.registerRule('min', {}, (value: any, { min }: { min: number }) => {
  if (isString(value) || isArray(value)) {
    return value.length >= min;
  } else if (isNumber(value)) {
    return value >= min;
  } else {
    return false;
  }
});
