import isUppercase = require('validator/lib/isUppercase');
import Validator from '../Validator';

Validator.registerRule('uppercase', (value: any) => {
  return isUppercase(value);
}, {
  depends: { string: true },
});
