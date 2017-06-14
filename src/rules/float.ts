import Validator from '../validator';
import { isFloat } from '../internal/utils';

Validator.registerRule('float', (value: any) => isFloat(value));
