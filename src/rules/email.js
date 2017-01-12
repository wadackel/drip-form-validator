import Validator from "../validator";
import isEmail from "validator/lib/isEmail";
import { isString } from "../utils";

Validator.addRule("email", [{ required: true }], (value, params) => {
  if (!isString(value)) return false;
  return params ? isEmail(value, params) : isEmail(value);
});
