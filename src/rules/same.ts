import isEqual = require('lodash.isequal');
import Validator, { Values } from '../validator';
import { hasProp } from '../internal/utils';

Validator.registerRule('same', (value: any, { key }: { key: string }, _: any, values: Values) => {
  return hasProp(values, key) && isEqual(value, values[key]);
}, {
  mapArgsToParams: (key: string) => ({ key }),
});
