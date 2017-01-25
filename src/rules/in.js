import Validator from "../validator";

Validator.addRule("in", (value, { values }) => (
  values.indexOf(value) > -1
));
