import isEqual = require('lodash.isequal');
import Validator from '../Validator';

Validator.registerRule('equals', (value: any, { value: _value }: { value: any }) => {
  return isEqual(value, _value);
}, {
  mapArgsToParams: (value: any) => ({ value }),
});
