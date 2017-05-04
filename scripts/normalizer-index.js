const createIndex = require('./create-index');

createIndex('normalizers', [], [
  'ltrim.ts',
  'rtrim.ts',
  'toBoolean.ts',
  'toDate.ts',
  'toFloat.ts',
  'toInt.ts',
  'toString.ts',
  'trim.ts',
]);
