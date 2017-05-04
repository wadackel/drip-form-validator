import Validator from '../validator';
import { isInteger } from '../internal/utils';

Validator.registerRule('integer', {}, (value: any) => isInteger(value));
