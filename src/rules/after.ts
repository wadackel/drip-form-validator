import isAfter = require('date-fns/is_after');
import Validator from '../validator';
import { isString, isNumber, isDate } from '../internal/utils';

Validator.registerRule('after', (value: any, { date }: { date: string | number | Date }) => {
  if (!isString(value) && !isNumber(value) && !isDate(value)) {
    return false;
  }

  return isAfter(value, date);
}, {
  mapArgsToParams: (date: string | number | Date) => ({ date }),
});
