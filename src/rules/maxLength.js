import Validator from "../validator";

Validator.addRule("maxLength", { string: true }, (value, { max }) => (
  value.length <= max
));
