import Validator from "../validator";
import { isString } from "../utils";

Validator.addRule("length", (value, { min, max }) => (
  isString(value) && value.length >= min && value.length <= max
));
