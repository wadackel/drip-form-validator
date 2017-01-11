import Validator from "../validator";
import { isNumber } from "../utils";

Validator.addRule("number", value => (
  isNumber(value)
));
