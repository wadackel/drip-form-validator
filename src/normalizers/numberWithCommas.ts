import Validator from '../Validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerNormalizer('numberWithCommas', (value: any) => {
  if (!isString(value) && !isNumber(value)) {
    return value;
  }

  const num = parseFloat(`${value}`.replace(/,/g, ''));

  if (isNaN(num)) {
    return value;
  }

  const tokens = `${num}`.split('.');

  tokens[0] = tokens[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return tokens.join('.');
});
