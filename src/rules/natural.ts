import Validator from '../validator';
import { isInteger } from '../internal/utils';

Validator.registerRule('natural', { number: true }, (value: any, params: { disallowZero?: boolean } | null) => {
  const disallowZero = params && params.disallowZero;
  return isInteger(value) && (disallowZero ? value > 0 : value >= 0);
});
