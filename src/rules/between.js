import Validator from "../validator";
import { isString, isNumber, isArray } from "../utils";

Validator.addRule("between", (value, { min, max }) => {
  if (isString(value) || isArray(value)) {
    return value.length >= min && value.length <= max;
  } else if (isNumber(value)) {
    return value >= min && value <= max;
  } else {
    return false;
  }
});
