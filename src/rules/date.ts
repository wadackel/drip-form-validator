import Validator from '../Validator';
import { isDate } from '../internal/utils';

Validator.registerRule('date', (value: any) => isDate(value));
