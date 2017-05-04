import isUppercase = require('validator/lib/isUppercase');
import Validator from '../validator';

Validator.registerRule('uppercase', { string: true }, (value: any) => {
  return isUppercase(value);
});
