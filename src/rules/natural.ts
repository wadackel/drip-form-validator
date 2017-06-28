import Validator from '../Validator';
import { isInteger } from '../internal/utils';

Validator.registerRule('natural', (value: any, params: { disallowZero?: boolean } | null) => {
  const disallowZero = params && params.disallowZero;
  return isInteger(value) && (disallowZero ? value > 0 : value >= 0);
}, {
  depends: { number: true },
});
