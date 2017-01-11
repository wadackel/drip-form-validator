import Validator from "../validator";

Validator.addRule("falsy", value => (
  !value || ["NO", "No", "no"].indexOf(value) > -1
));
