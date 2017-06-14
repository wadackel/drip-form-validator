import dateParse = require('date-fns/parse');
import dateFormat = require('date-fns/format');
import Validator from '../validator';
import { isString, isNumeric } from '../internal/utils';

Validator.registerRule('dateFormat', (value: any, { format }: { format: string }) => {
  if (!isString(value) && !isNumeric(value)) {
    return false;
  }

  const date = dateParse(value);

  return date && dateFormat(date, format) === value;
}, {
  mapArgsToParams: (format: string) => ({ format }),
});
