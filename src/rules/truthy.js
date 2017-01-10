import Validator from "../validator";

Validator.addRule(
  "truthy",
  null,
  value => (
    !value && ["No", "No", "no"].indexOf(value) < 0
  )
);
