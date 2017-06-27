import Validator from '../Validator';
import { isString, isNumber } from '../internal/utils';

Validator.registerRule('format', (value: any, { regex }: { regex: RegExp }) => {
  return (isString(value) || isNumber(value)) && regex.test(`${value}`);
}, {
  mapArgsToParams: (regex: RegExp) => ({ regex }),
});
