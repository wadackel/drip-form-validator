import Validator, { Values } from '../validator';
import { hasProp } from '../internal/utils';

Validator.registerRule('present', (_: any, __: any, field: string, values: Values) => {
  return hasProp(values, field);
}, {
  implicit: false,
});
