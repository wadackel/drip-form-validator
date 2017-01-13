import Validator from "../validator";

Validator.addRule("min", { number: true }, (value, { min }) => (
  value >= min
));
