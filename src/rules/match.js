import Validator from "../validator";
import { isString, isNumber } from "../utils";

Validator.addRule("match", (value, { regex }) => (
  (isString(value) || isNumber(value)) && regex.test(value)
));
