import Validator from "../validator";

Validator.addRule("range", { number: true }, (value, { min, max }) => (
  value >= min && value <= max
));
