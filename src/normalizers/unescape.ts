import unescape = require('validator/lib/unescape');
import Validator from '../validator';

Validator.registerNormalizer('unescape', (value: any) => {
  return unescape(value);
}, {
  depends: { toString: true },
});
