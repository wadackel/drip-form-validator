import escape = require('validator/lib/escape');
import Validator from '../validator';

Validator.registerNormalizer('escape', { toString: true }, (value: any) => {
  return escape(value);
});
