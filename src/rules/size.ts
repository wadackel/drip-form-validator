import Validator from '../Validator';
import { isString, isNumber, isArray } from '../internal/utils';

Validator.registerRule('size', (value: any, { value: _value }: { value: number }) => {
  if (isString(value) || isArray(value)) {
    return value.length === _value;
  } else if (isNumber(value)) {
    return value === _value;
  } else {
    return false;
  }
}, {
  mapArgsToParams: (value: number) => ({ value }),
});
