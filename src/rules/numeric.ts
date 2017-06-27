import Validator from '../Validator';
import { isNumeric } from '../internal/utils';

Validator.registerRule('numeric', (value: any) => isNumeric(value));
