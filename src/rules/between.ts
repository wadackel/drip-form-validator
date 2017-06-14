import Validator from '../validator';
import { isNumeric, isString, isArray } from '../internal/utils';

Validator.registerRule('between', (value: any, { min, max }: { min: number, max: number }) => {
  if (isNumeric(value)) {
    const num = parseFloat(<any>value);
    return num >= min && num <= max;
  } else if (isString(value) || isArray(value)) {
    return value.length >= min && value.length <= max;
  } else {
    return false;
  }
});
