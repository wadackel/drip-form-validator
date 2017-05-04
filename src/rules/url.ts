import isPlainObject = require('lodash.isplainobject');
import isURL = require('validator/lib/isURL');
import Validator from '../validator';

Validator.registerRule('url', { string: true }, (value: any, params: any) => {
  return isURL(
    value,
    {
      protocols: ['http', 'https', 'ftp'],
      require_protocol: true,
      ...(isPlainObject(params) ? params : {}),
    },
  );
});
