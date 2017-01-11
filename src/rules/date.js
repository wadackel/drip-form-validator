import Validator from "../validator";
import isDate from "validator/lib/isDate";
import { isString } from "../utils";

Validator.addRule("date", value => (
  value instanceof Date || (isString(value) && isDate(value))
));
