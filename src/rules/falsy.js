import Validator from "../validator";

Validator.addRule(
  "falsy",
  null,
  value => (
    !!value && ["No", "No", "no"].indexOf(value) > -1
  )
);
