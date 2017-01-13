import Validator from "../validator";

Validator.addRule("minLength", { string: true }, (value, { min }) => (
  value.length >= min
));
