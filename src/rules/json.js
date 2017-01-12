import Validator from "../validator";
import isJSON from "validator/lib/isJSON";

Validator.addRule("json", { string: true }, value => (
  isJSON(value)
));
