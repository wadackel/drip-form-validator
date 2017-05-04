import Validator, { Values } from '../validator';
import { hasProp, isNumeric, isEmpty } from '../internal/utils';

Validator.registerRule('required', {}, (value: any, _: any, field: string, values: Values) => {
  return hasProp(values, field) && isNumeric(value) ? true : !isEmpty(value);
}, false);
