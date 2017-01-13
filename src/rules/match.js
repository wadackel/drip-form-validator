import Validator from "../validator";
import { isString, isNumber } from "../utils";

Validator.addRule("match", { required: true }, (value, { regex }) => (
  (isString(value) || isNumber(value)) && regex.test(value)
));
