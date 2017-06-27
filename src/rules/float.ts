import Validator from '../Validator';
import { isFloat } from '../internal/utils';

Validator.registerRule('float', (value: any) => isFloat(value));
