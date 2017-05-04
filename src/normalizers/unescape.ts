import unescape = require('validator/lib/unescape');
import Validator from '../validator';

Validator.registerNormalizer('unescape', { toString: true }, (value: any) => {
  return unescape(value);
});
