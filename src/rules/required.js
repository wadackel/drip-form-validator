import Validator from "../validator";
import { hasProp, isNumeric, isEmpty } from "../utils";

Validator.addRule("required", (value, _, key, values) => (
  hasProp(values, key) && isNumeric(value) ? true : !isEmpty(value)
), false);
