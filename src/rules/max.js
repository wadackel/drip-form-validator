import Validator from "../validator";

Validator.addRule("max", { number: true }, (value, { max }) => (
  value <= max
));
