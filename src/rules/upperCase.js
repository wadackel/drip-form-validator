import Validator from "../validator";
import isUppercase from "validator/lib/isUppercase";

Validator.addRule("upperCase", { string: true }, value => (
  isUppercase(value)
));
