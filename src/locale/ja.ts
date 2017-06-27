import format = require('date-fns/format');
import Validator, { MessageCreatorParams } from '../Validator';


const dateToString = (date: Date | string | number): string => format(date, 'YYYY-MM-DD HH:mm:ss');


Validator.defineLocale('ja', {
  defaultMessage: '{{field}}が正しくありません。',

  after: (field: string, _: any, params: MessageCreatorParams): string => (
    `${field}は${dateToString(params.date)}より後の日付を指定してください。.`
  ),
  alpha: '{{field}}にはアルファベットのみご利用できます。',
  alphaDash: '{{field}}にはアルファベットとダッシュ(-)及び下線(_)がご利用できます。',
  alphaNumeric: '{{field}}には英数字がご利用できます。',
  array: '{{field}}は配列でなくてはなりません。',
  before: (field: string, _: any, params: MessageCreatorParams): string => (
    `${field}は${dateToString(params.date)}より前の日付を指定してください。.`
  ),
  between: {
    defaultMessage: '{{field}}は{{min}}から{{max}}の間で指定してください。',
    string: '{{field}}は{{min}}から{{max}}文字の間で指定してください。',
    array: '{{field}}は{{min}}から{{max}}個の間で指定してください。',
  },
  betweenWith: '{{field}}は{{min}}から{{max}}の間で指定してください。',
  date: '{{field}}には有効な日付を指定してください。',
  dateFormat: '{{field}}には有効な日付を指定してください。',
  different: '{{field}}は{{label}}には異なる内容を指定してください。',
  email: '{{field}}には有効なメールアドレスを指定してください。',
  equals: '{{field}}は"{{value}}"でなくてはなりません。',
  falsy: '{{field}}は無効な内容でなくてはなりません。',
  float: '{{field}}は少数を含む数値でなくてはなりません。',
  format: '{{field}}の形式が正しくありません。',
  in: '{{field}}が正しくありません。',
  integer: '{{field}}は整数でなくてはなりません。',
  lowercase: '{{field}}は小文字でなくてはなりません。',
  max: {
    defaultMessage: '{{field}}は{{max}}以下を指定してください。',
    string: '{{field}}は{{max}}文字以下で指定してください。',
    array: '{{field}}は{{max}}個以下で指定してください。',
  },
  maxWith: '{{field}}は{{max}}以下の数値を指定してください。',
  min: {
    defaultMessage: '{{field}}は{{min}}以上を指定してください。',
    string: '{{field}}は{{min}}文字以上で指定してください。',
    array: '{{field}}は{{min}}個以上で指定してください。',
  },
  minWith: '{{field}}は{{min}}以上を指定してください。',
  natural: '{{field}}は自然数でなくてはなりません。',
  notIn: '{{field}}が正しくありません。',
  number: '{{field}}は数値でなくてはなりません。',
  numeric: '{{field}}は数値でなくてはなりません。',
  object: '{{field}}はオブジェクトでなくてはなりません。',
  present: '{{field}}が存在する必要があります。',
  required: '{{field}}は必須項目です。',
  same: '{{field}}と{{label}}は一致しなくてはなりません。',
  size: {
    defaultMessage: '{{field}}は{{size}}を指定してください。',
    string: '{{field}}は{{size}}文字で指定してください。',
    array: '{{field}}は{{size}}個で指定してください。',
  },
  string: '{{field}}は文字列を指定してください。',
  time: '{{field}}は有効な時間を指定してください。',
  truthy: '{{field}}は有効な内容を指定してください。',
  uppercase: '{{field}}は大文字でなくてはなりません。',
  url: '{{field}}の形式が正しくありません。',
});
