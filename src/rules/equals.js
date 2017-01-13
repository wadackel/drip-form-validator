import Validator from "../validator";
import isEqual from "lodash.isequal";

Validator.addRule("equals", { required: true }, (value, params) => (
  isEqual(value, params.value)
));
