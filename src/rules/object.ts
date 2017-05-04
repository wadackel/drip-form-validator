import isPlainObject = require('lodash.isplainobject');
import Validator from '../validator';

Validator.registerRule('object', {}, (value: any) => isPlainObject(value));
