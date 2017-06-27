import isLowercase = require('validator/lib/isLowercase');
import Validator from '../Validator';

Validator.registerRule('lowercase', (value: any) => {
  return isLowercase(value);
}, {
  depends: { string: true },
});
