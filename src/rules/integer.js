import Validator from "../validator";
import { isInteger } from "../utils";

Validator.addRule("integer", value => (
  isInteger(value)
));
