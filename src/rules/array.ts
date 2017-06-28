import Validator from '../Validator';
import { isArray } from '../internal/utils';

Validator.registerRule('array', (value: any) => isArray(value));
