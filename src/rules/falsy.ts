import Validator from '../validator';

Validator.registerRule('falsy', (value: any) => {
  return ['no', '0', 'false'].indexOf(`${value}`.toLowerCase()) > -1;
});
