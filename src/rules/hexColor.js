import Validator from "../validator";
import isHexColor from "validator/lib/isHexColor";

Validator.addRule("hexColor", { string: true }, value => (
  isHexColor(value)
));
