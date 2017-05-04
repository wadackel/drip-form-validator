import Validator from '../validator';

Validator.registerRule('alphaNumeric', { string: true }, (value: any) => {
  return /^[A-Za-z\d]+$/.test(value);
});
