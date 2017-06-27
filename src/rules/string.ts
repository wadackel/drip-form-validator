import Validator from '../Validator';
import { isString } from '../internal/utils';

Validator.registerRule('string', (value: any) => isString(value));
