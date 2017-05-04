import Validator from '../validator';
import { isDate } from '../internal/utils';

Validator.registerRule('date', {}, (value: any) => isDate(value));
