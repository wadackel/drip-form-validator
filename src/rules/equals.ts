import isEqual = require('lodash.isequal');
import Validator from '../validator';

Validator.registerRule('equals', {}, (value: any, { value: _value }: { value: any }) => {
  return isEqual(value, _value);
});