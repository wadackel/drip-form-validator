import format = require('date-fns/format');
import Validator, { MessageCreatorParams } from '../validator';


const dateToString = (date: Date | string | number): string => format(date, 'YYYY-MM-DD HH:mm:ss');


Validator.defineLocale('en', {
  defaultMessage: 'The {{field}} field is invalid.',

  after: (field: string, _: any, params: MessageCreatorParams): string => (
    `The ${field} must be a date after ${dateToString(params.date)}.`
  ),
  alpha: 'The {{field}} may only contain letters.',
  alphaDash: 'The {{field}} may only contain letters, numbers, and dashes.',
  alphaNumeric: 'The {{field}} may only contain letters and numbers.',
  array: 'The {{field}} must be an array.',
  before: (field: string, _: any, params: MessageCreatorParams): string => (
    `The ${field} must be a date before ${dateToString(params.date)}.`
  ),
  between: {
    defaultMessage: 'The {{field}} must be between {{min}} and {{max}}.',
    string: 'The {{field}} must be between {{min}} and {{max}} characters.',
    array: 'The {{field}} must be between {{min}} and {{max}} items.',
  },
  date: 'The {{field}} is not a valid date.',
  dateFormat: 'The {{field}} does not matche the date format {{format}}.',
  different: 'The {{field}} and {{key}} must be different.',
  email: 'The {{field}} must be a valid email address.',
  equals: 'The {{field}} must be "{{value}}".',
  falsy: 'The {{field}} must not be truthy.',
  float: 'The {{field}} must be an float.',
  format: 'The {{field}} format is invalid.',
  in: 'The {{field}} is invalid.',
  integer: 'The {{field}} must be an integer.',
  lowercase: 'The {{field}} must be lower case.',
  max: {
    defaultMessage: 'The {{field}} may note be greater than {{max}}.',
    string: 'The {{field}} may note be greater than {{max}} characters.',
    array: 'The {{field}} may note be greater than {{max}} items.',
  },
  min: {
    defaultMessage: 'The {{field}} must be at least {{min}}.',
    string: 'The {{field}} must be at least {{min}} characters.',
    array: 'The {{field}} must be at least {{min}} items.',
  },
  natural: 'The {{field}} must be a natural number.',
  notIn: 'The {{field}} is invalid.',
  number: 'The {{field}} must be a number.',
  numeric: 'The {{field}} must be a number.',
  object: 'The {{field}} must be a object.',
  present: 'The {{field}} field must be present.',
  required: 'The {{field}} field is required.',
  same: 'The {{field}} and {{key}} must match.',
  size: {
    defaultMessage: 'The {{field}} must be {{size}}.',
    string: 'The {{field}} must be {{size}} characters.',
    array: 'The {{field}} must be {{size}} items.',
  },
  string: 'The {{field}} must be a string.',
  time: 'The {{field}} must be valid time.',
  truthy: 'The {{field}} must be truthy.',
  uppercase: 'The {{field}} must be upper case.',
  url: 'The {{field}} format is invalid.',
});
