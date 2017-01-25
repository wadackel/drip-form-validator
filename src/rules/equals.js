import Validator from "../validator";
import isEqual from "lodash.isequal";

Validator.addRule("equals", (value, params) => (
  isEqual(value, params.value)
));
