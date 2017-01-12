import Validator from "../validator";
import { isFloat } from "../utils";

Validator.addRule("float", value => (
  isFloat(value)
));
