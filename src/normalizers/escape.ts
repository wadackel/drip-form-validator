import escape = require('validator/lib/escape');
import Validator from '../validator';

Validator.registerNormalizer('escape', (value: any) => {
  return escape(value);
}, {
  depends: { toString: true },
});
