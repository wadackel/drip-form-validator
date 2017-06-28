import Validator from '../Validator';
import { isInteger } from '../internal/utils';

Validator.registerRule('integer', (value: any) => isInteger(value));
