import Validator from '../Validator';

Validator.registerRule('notIn', (value: any, { values }: { values: any[] }) => {
  return values.indexOf(value) < 0;
}, {
  mapArgsToParams: (values: any[]) => ({ values }),
});
