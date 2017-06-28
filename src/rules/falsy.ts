import Validator from '../Validator';

Validator.registerRule('falsy', (value: any) => {
  return ['no', '0', 'false'].indexOf(`${value}`.toLowerCase()) > -1;
});
