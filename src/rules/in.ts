import Validator from '../Validator';

Validator.registerRule('in', (value: any, { values }: { values: any[] }) => {
  return values.indexOf(value) > -1;
}, {
  mapArgsToParams: (values: any[]) => ({ values }),
});
