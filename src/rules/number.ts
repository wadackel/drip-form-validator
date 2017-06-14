import Validator from '../validator';
import { isNumber } from '../internal/utils';

Validator.registerRule('number', (value: any) => isNumber(value));
