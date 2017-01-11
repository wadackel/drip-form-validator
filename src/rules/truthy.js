import Validator from "../validator";

Validator.addRule("truthy", value => (
  !!value && ["NO", "No", "no"].indexOf(value) < 0
));
