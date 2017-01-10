drip-form-validator
===================

[![Build Status](http://img.shields.io/travis/tsuyoshiwada/drip-form-validator.svg?style=flat-square)](https://travis-ci.org/tsuyoshiwada/drip-form-validator)
[![npm version](https://img.shields.io/npm/v/drip-form-validator.svg?style=flat-square)](http://badge.fury.io/js/drip-form-validator)

:zap: **WIP PROJECT**

> Simple form validation logic for JavaScript.



## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)



## Install

```bash
$ npm install drip-form-validator
```



## Usage

```javascript
import Validator from "drip-form-validator";

const data = {
  firstName: null,
  lastName: "wada",
  phone: "hoge",
  age: "fuga",
  email: "mail-address",
  website: null,
  confirmed: true
};

const validator = new Validator(data, {
  firstName: ["required"],
  lastName: ["required"],
  phone: ["phone"],
  age: ["required", "numeric"],
  email: ["email"],
  website: ["url"],
  confirmed: ["truthy"]
});

if (validator.validate()) {
  console.error(validator.getErrors());
  // TODO

} else {
  // data is valid
}
```



## API

### Validation rules

```javascript
// TODO
```



## Contribute

PRs accepted.



## License

[MIT © tsuyoshiwada](./LICENSE)
