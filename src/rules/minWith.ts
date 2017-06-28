import * as dot from 'dot-wild';
import Validator, { Values } from '../Validator';
import { isNumeric, isString, isArray } from '../internal/utils';

Validator.registerRule('minWith', (value: any, { key }: { key: string }, _: any, values: Values) => {
  if (!dot.has(values, key)) {
    return false;
  }

  let min = dot.get(values, key);

  if (!isNumeric(min)) {
    return false;
  }

  min = parseFloat(<any>min);

  if (isNumeric(value)) {
    return parseFloat(<any>value) >= min;
  } else if (isString(value) || isArray(value)) {
    return value.length >= min;
  }

  return false;
}, {
  mapArgsToParams: (key: string, v: Validator) => ({
    key,
    label: v.getLabel(key),
  }),
});
