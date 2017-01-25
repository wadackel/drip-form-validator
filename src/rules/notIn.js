import Validator from "../validator";

Validator.addRule("notIn", (value, { values }) => (
  values.indexOf(value) < 0
));
