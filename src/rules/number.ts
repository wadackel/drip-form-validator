import Validator from '../Validator';
import { isNumber } from '../internal/utils';

Validator.registerRule('number', (value: any) => isNumber(value));
