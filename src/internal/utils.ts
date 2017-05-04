import _isEmpty = require('lodash.isempty');

export const hasProp = (obj: any, name: string): boolean => obj.hasOwnProperty(name);

export const typeOf = (val: any): string => {
  if (val === undefined) {
    return 'undefined';
  } else if (val === null) {
    return 'null';
  }
  return val.constructor.name.toLowerCase();
};

export const isBoolean = (val: any): val is boolean => typeOf(val) === 'boolean';
export const isString = (val: any): val is string => typeOf(val) === 'string';
export const isNumber = (val: any): val is number => typeOf(val) === 'number';
export const isArray = (val: any): val is any[] => Array.isArray(val);
export const isDate = (val: any): val is Date => typeOf(val) === 'date';
export const isFunction = (val: any): boolean => !!(val && val.constructor && val.call && val.apply);
export const isPromise = (val: any): boolean => !!(val && isFunction(val.then));
export const isNumeric = (val: any): boolean => !isArray(val) && (val - parseFloat(val) + 1) >= 0;
export const isInteger = (val: any): boolean => Number(val) === val && val % 1 === 0;
export const isFloat = (val: any): boolean => Number(val) === val && val % 1 !== 0;

export const isEmpty = (val: any): boolean => {
  if (isDate(val)) return false;
  if (isBoolean(val)) return !val;
  if (isNumeric(val) && parseFloat(val) !== 0) return false;
  return _isEmpty(val);
};

export const template = (format: string, data: { [index: string]: any } | null): string => (
  format.replace(/{{([\s\S]+?)}}/g, (_, key) => data && hasProp(data, key) ? data[key] : '')
);
