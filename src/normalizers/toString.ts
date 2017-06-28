import Validator from '../Validator';

// Based by: https://github.com/chriso/validator.js/blob/master/src/lib/util/toString.js
Validator.registerNormalizer('toString', (value: any) => {
  let result = value;

  if (typeof value === 'object' && value !== null) {
    result = typeof value.toString === 'function' ? value.toString() : '[object Object]';
  } else if (value === null || typeof value === 'undefined' || (isNaN(value) && !value.length)) {
    result = '';
  }

  return String(result);
});
