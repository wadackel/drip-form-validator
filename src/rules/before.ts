import isBefore = require('date-fns/is_before');
import Validator from '../Validator';
import { isString, isNumber, isDate } from '../internal/utils';

Validator.registerRule('before', (value: any, { date }: { date: string | number | Date }) => {
  if (!isString(value) && !isNumber(value) && !isDate(value)) {
    return false;
  }

  return isBefore(value, date);
}, {
  mapArgsToParams: (date: string | number | Date) => ({ date }),
});
