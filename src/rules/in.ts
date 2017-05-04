import Validator from '../validator';

Validator.registerRule('in', {}, (value: any, { values }: { values: any[] }) => {
  return values.indexOf(value) > -1;
});
