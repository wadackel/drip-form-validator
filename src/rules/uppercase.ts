import isUppercase = require('validator/lib/isUppercase');
import Validator from '../validator';

Validator.registerRule('uppercase', (value: any) => {
  return isUppercase(value);
}, {
  depends: { string: true },
});
