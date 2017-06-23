import * as dot from 'dot-wild';
import Validator, { Values } from '../validator';
import { isNumeric, isString, isArray } from '../internal/utils';

Validator.registerRule('maxWith', (value: any, { key }: { key: string }, _: any, values: Values) => {
  if (!dot.has(values, key)) {
    return false;
  }

  let max = dot.get(values, key);

  if (!isNumeric(max)) {
    return false;
  }

  max = parseFloat(<any>max);

  if (isNumeric(value)) {
    return parseFloat(<any>value) <= max;
  } else if (isString(value) || isArray(value)) {
    return value.length <= max;
  }

  return false;
}, {
  mapArgsToParams: (key: string, v: Validator) => ({
    key,
    label: v.getLabel(key),
  }),
});
