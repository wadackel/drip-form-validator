import Validator from "../validator";
import isURL from "validator/lib/isURL";
import { isString } from "../utils";

Validator.addRule("url", (value, params) => {
  if (!isString(value)) return false;
  return params ? isURL(value, params) : isURL(value);
});
