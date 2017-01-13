import Validator from "../validator";

Validator.addRule("in", { required: true }, (value, { values }) => (
  values.indexOf(value) > -1
));
