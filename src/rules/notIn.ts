import Validator from '../validator';

Validator.registerRule('notIn', {}, (value: any, { values }: { values: any[] }) => {
  return values.indexOf(value) < 0;
});
