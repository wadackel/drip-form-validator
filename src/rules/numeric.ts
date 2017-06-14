import Validator from '../validator';
import { isNumeric } from '../internal/utils';

Validator.registerRule('numeric', (value: any) => isNumeric(value));
