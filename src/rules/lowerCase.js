import Validator from "../validator";
import isLowercase from "validator/lib/isLowercase";

Validator.addRule("lowerCase", { string: true }, value => (
  isLowercase(value)
));
