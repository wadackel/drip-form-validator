import unescape = require('validator/lib/unescape');
import Validator from '../Validator';

Validator.registerNormalizer('unescape', (value: any) => {
  return unescape(value);
}, {
  depends: { toString: true },
});
