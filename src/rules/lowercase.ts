import isLowercase = require('validator/lib/isLowercase');
import Validator from '../validator';

Validator.registerRule('lowercase', { string: true }, (value: any) => {
  return isLowercase(value);
});
