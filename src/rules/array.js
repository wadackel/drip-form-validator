import Validator from "../validator";
import { isArray } from "../utils";

Validator.addRule("array", value => (
  isArray(value)
));
