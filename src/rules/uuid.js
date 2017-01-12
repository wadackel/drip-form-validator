import Validator from "../validator";
import isUUID from "validator/lib/isUUID";

Validator.addRule("uuid", { string: true }, value => (
  isUUID(value)
));
