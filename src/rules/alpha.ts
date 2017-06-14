import Validator from '../validator';

Validator.registerRule('alpha', (value: any) => {
  return /^[A-Za-z]+$/.test(value);
}, {
  depends: { string: true },
});
