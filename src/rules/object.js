import Validator from "../validator";
import isPlainObject from "lodash.isplainobject";

Validator.addRule("object", value => (
  isPlainObject(value)
));
