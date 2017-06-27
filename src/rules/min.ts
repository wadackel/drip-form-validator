import Validator from '../Validator';
import { isNumeric, isString, isArray } from '../internal/utils';

Validator.registerRule('min', (value: any, { min }: { min: number }) => {
  if (isNumeric(value)) {
    return parseFloat(<any>value) >= min;
  } else if (isString(value) || isArray(value)) {
    return value.length >= min;
  } else {
    return false;
  }
}, {
  mapArgsToParams: (min: number) => ({ min }),
});
