import Validator from '../validator';
import { hasProp, isNumeric } from '../internal/utils';

Validator.registerNormalizer('betweenWith', (value: any, { min, max }: { min: string, max: string }, _: any, values: any) => {
  if (
    hasProp(values, min) &&
    hasProp(values, max) &&
    isNumeric(values[min]) &&
    isNumeric(values[max]) &&
    isNumeric(value)
  ) {
    const _value = parseFloat(<any>value);
    const _min = parseFloat(<any>values[min]);
    const _max = parseFloat(<any>values[max]);

    return Math.min(Math.max(_value, _min), _max);
  }

  return value;
});
