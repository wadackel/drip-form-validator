import Validator from "../validator";

Validator.defineLocale("ja", {
  defaultMessage: "値が正しくありません",
  truthy: "真値である必要があります",
  falsy: "偽値である必要があります",
  string: "文字列である必要があります",
  number: "数値である必要があります",
  integer: "整数である必要があります",
  float: "少数を含む数値である必要があります",
  numeric: "数値である必要があります",
  required: "必須項目です",
  alpha: "英字である必要があります",
  alphaDash: "英数字(-や_を含む)である必要があります",
  alphaNum: "英数字である必要があります",
  date: "日付が正しくありません",
  min: {
    string: "{{min}}文字以上である必要があります",
    number: "{{min}}以上である必要があります",
    array: "{{min}}以上である必要があります"
  },
  max: {
    string: "{{max}}文字以下である必要があります",
    number: "{{max}}以下である必要があります",
    array: "{{max}}以下である必要があります"
  },
  between: {
    string: "{{min}}〜{{max}}文字である必要があります",
    number: "{{min}}〜{{max}}である必要があります",
    array: "{{min}}〜{{max}}である必要があります"
  },
  url: "URLの形式が正しくありません",
  email: "Emailアドレスの形式が正しくありません",
  regex: "形式が異なります",
  same: "値が一致しません",
  different: "値が正しくありません",
  in: "値が正しくありません",
  notIn: "値が正しくありません"
});
