import Validator from '../validator';

Validator.registerRule('alphaDash', { string: true }, (value: any) => {
  return /^[A-Za-z\d-_]+$/.test(value);
});
