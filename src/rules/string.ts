import Validator from '../validator';
import { isString } from '../internal/utils';

Validator.registerRule('string', (value: any) => isString(value));
