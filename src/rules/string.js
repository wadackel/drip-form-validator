import Validator from "../validator";
import { isString } from "../utils";

Validator.addRule("string", value => (
  isString(value)
));
