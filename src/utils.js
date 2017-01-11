export const typeOf = val => typeof val;
export const isBoolean = val => typeOf(val) === "boolean";
export const isString = val => typeOf(val) === "string";
export const isNumber = val => typeOf(val) === "number";
export const isArray = val => Array.isArray(val);
export const isNumeric = val => !isArray(val) && (val - parseFloat(val) + 1) >= 0;
export const isInteger = val => Number(val) === val && val % 1 === 0;
export const isFloat = val => Number(val) === val && val % 1 !== 0;

export const hasProp = (obj, name) => obj.hasOwnProperty(name);

export const template = (str, data) => (
  str.replace(/{{([\s\S]+?)}}/g, (all, key) => data && hasProp(data, key) ? data[key] : "")
);
