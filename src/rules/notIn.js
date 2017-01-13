import Validator from "../validator";

Validator.addRule("notIn", { required: true }, (value, { values }) => (
  values.indexOf(value) < 0
));
