import Validator from '../validator';

Validator.registerRule('alphaNumeric', (value: any) => {
  return /^[A-Za-z\d]+$/.test(value);
}, {
  depends: { string: true },
});
