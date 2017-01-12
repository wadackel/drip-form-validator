import Validator from "../validator";

Validator.addRule("alphaNumeric", { string: true }, value => (
  /^[A-Za-z\d]+$/.test(value)
));
