import dateParse = require('date-fns/parse');
import dateFormat = require('date-fns/format');
import Validator from '../validator';
import { isString, isNumeric } from '../internal/utils';

Validator.registerRule('time', (value: any) => {
  if (!isString(value) && !isNumeric(value)) {
    return false;
  }

  const date = dateParse(`2010-01-01 ${value}`);

  return date && dateFormat(date, 'HH:mm:ss') === value;
});
