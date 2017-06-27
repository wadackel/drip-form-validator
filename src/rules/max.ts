import Validator from '../Validator';
import { isNumeric, isString, isArray } from '../internal/utils';

Validator.registerRule('max', (value: any, { max }: { max: number }) => {
  if (isNumeric(value)) {
    return parseFloat(<any>value) <= max;
  } else if (isString(value) || isArray(value)) {
    return value.length <= max;
  } else {
    return false;
  }
}, {
  mapArgsToParams: (max: number) => ({ max }),
});
