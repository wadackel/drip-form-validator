import Validator from "../validator";
import isCreditCard from "validator/lib/isCreditCard";

Validator.addRule("creditCard", { string: true }, value => (
  isCreditCard(value)
));
