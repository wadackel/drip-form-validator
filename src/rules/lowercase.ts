import isLowercase = require('validator/lib/isLowercase');
import Validator from '../validator';

Validator.registerRule('lowercase', (value: any) => {
  return isLowercase(value);
}, {
  depends: { string: true },
});
