import Validator from "../validator";
import { isString, isNumber, isArray } from "../utils";

Validator.addRule("max", { required: true }, (value, { max }) => {
  if (isString(value) || isArray(value)) {
    return value.length <= max;
  } else if (isNumber(value)) {
    return value <= max;
  } else {
    return false;
  }
});
