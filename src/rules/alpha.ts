import Validator from '../Validator';

Validator.registerRule('alpha', (value: any) => {
  return /^[A-Za-z]+$/.test(value);
}, {
  depends: { string: true },
});
