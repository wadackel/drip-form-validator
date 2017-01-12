import Validator from "../validator";
import isIP from "validator/lib/isIP";

Validator.addRule("ip", { string: true }, value => (
  isIP(value)
));
