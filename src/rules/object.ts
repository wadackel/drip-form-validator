import isPlainObject = require('lodash.isplainobject');
import Validator from '../Validator';

Validator.registerRule('object', (value: any) => isPlainObject(value));
