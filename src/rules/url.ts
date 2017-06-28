import isPlainObject = require('lodash.isplainobject');
import isURL = require('validator/lib/isURL');
import Validator from '../Validator';

Validator.registerRule('url', (value: any, params: any) => {
  return isURL(
    value,
    {
      protocols: ['http', 'https', 'ftp'],
      require_protocol: true,
      ...(isPlainObject(params) ? params : {}),
    },
  );
}, {
  depends: { string: true },
});
