import Validator from "../validator";
import { isNumeric } from "../utils";

Validator.addRule("numeric", value => (
  isNumeric(value)
));
