import escape = require('validator/lib/escape');
import Validator from '../Validator';

Validator.registerNormalizer('escape', (value: any) => {
  return escape(value);
}, {
  depends: { toString: true },
});
