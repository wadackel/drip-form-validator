import Validator from "../validator";

Validator.addRule("alpha", { string: true }, value => (
  /^[A-Za-z]+$/.test(value)
));
