import Validator from '../validator';
import { isString, isNumber, isArray } from '../internal/utils';

Validator.registerRule('between', {}, (value: any, { min, max }: { min: number, max: number }) => {
  if (isString(value) || isArray(value)) {
    return value.length >= min && value.length <= max;
  } else if (isNumber(value)) {
    return value >= min && value <= max;
  } else {
    return false;
  }
});
