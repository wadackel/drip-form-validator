import Validator from "../validator";
import { hasProp, isNumeric, isEmpty } from "../utils";

Validator.addRule("required", (value, params, key, values) => (
  hasProp(values, key) && isNumeric(value) ? true : !isEmpty(value)
));
