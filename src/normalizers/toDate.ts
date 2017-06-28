import parse = require('date-fns/parse');
import Validator from '../Validator';
import { isString } from '../internal/utils';

Validator.registerNormalizer('toDate', (value: any) => {
  if (!isString(value)) {
    return value;
  }

  return parse(value);
});
