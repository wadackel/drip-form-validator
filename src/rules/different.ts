import isEqual = require('lodash.isequal');
import Validator, { Values } from '../Validator';
import { hasProp } from '../internal/utils';

Validator.registerRule('different', (value: any, { key }: { key: string }, _: any, values: Values) => {
  return hasProp(values, key) && !isEqual(value, values[key]);
}, {
  mapArgsToParams: (key: string, v: Validator) => ({
    key,
    label: v.getLabel(key),
  }),
});
