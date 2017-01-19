import _isDate from "validator/lib/isDate";
import _isEmpty from "lodash.isempty";

export const typeOf = val => {
  if (val === undefined) {
    return "undefined";
  } else if (val == null) {
    return "null";
  } else {
    return val.constructor.name.toLowerCase();
  }
};
export const isBoolean = val => typeOf(val) === "boolean";
export const isString = val => typeOf(val) === "string";
export const isNumber = val => typeOf(val) === "number";
export const isFunction = val => !!(val && val.constructor && val.call && val.apply);
export const isPromise = val => val && isFunction(val.then);
export const isDate = val => typeOf(val) === "date" ? true : isString(val) && _isDate(val);
export const isArray = val => Array.isArray(val);
export const isNumeric = val => !isArray(val) && (val - parseFloat(val, 10) + 1) >= 0;
export const isInteger = val => Number(val) === val && val % 1 === 0;
export const isFloat = val => Number(val) === val && val % 1 !== 0;
export const isEmpty = val => {
  if (isDate(val)) return false;
  if (isBoolean(val)) return !val;
  if (isNumeric(val) && parseFloat(val, 10) !== 0) return false;
  return _isEmpty(val);
};

export const hasProp = (obj, name) => obj.hasOwnProperty(name);

export const template = (str, data) => (
  str.replace(/{{([\s\S]+?)}}/g, (all, key) => data && hasProp(data, key) ? data[key] : "")
);
