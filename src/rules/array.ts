import Validator from '../validator';
import { isArray } from '../internal/utils';

Validator.registerRule('array', {}, (value: any) => isArray(value));
