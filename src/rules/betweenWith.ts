import * as dot from 'dot-wild';
import Validator, { Values } from '../Validator';
import { isNumeric, isString, isArray } from '../internal/utils';

interface RuleBetweenParams {
  min: string;
  max: string;
}

Validator.registerRule('betweenWith', (value: any, { min, max }: RuleBetweenParams, _: any, values: Values) => {
  if (!dot.has(values, min) || !dot.has(values, max)) {
    return false;
  }

  let minValue = dot.get(values, min);
  let maxValue = dot.get(values, max);

  if (!isNumeric(minValue) || !isNumeric(maxValue)) {
    return false;
  }

  minValue = parseFloat(<any>minValue);
  maxValue = parseFloat(<any>maxValue);

  if (isNumeric(value)) {
    const v = parseFloat(<any>value);

    return v >= minValue && v <= maxValue;
  } else if (isString(value) || isArray(value)) {
    return value.length >= minValue && value.length <= maxValue;
  }

  return false;
}, {
  mapArgsToParams: ({ min, max }: RuleBetweenParams, v: Validator) => ({
    min,
    max,
    minLabel: v.getLabel(min),
    maxLabel: v.getLabel(max),
  }),
});
