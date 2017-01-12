import Validator from "../validator";

Validator.addRule("alphaDash", { string: true }, value => (
  /^[A-Za-z\d-_]+$/.test(value)
));
