# Validating Array

It is usually a bit difficult to verify the contents of an array.  
However, drip-form-validator can be simply verified by using **wildcard(`*`)** and **dot notation**.

```javascript
import { Validator } from 'drip-form-validator';

const data = {
  members: [
    { name: 'Tsuyoshi Wada', email: 'example@mail.com' },
    { name: 'Test User', email: '' },
    { name: 12345, email: 'foo-bar' },
  ],
};

const v = new Validator(data, {
  'members.*.name': {
    required: true,
    string: true,
  },
  'members.*.email': {
    required: true,
    email: true,
  },
});

if (v.validate()) {
  // `data` is valid.

} else {
  console.log(v.getAllErrors());
  // { 'members.2.name':
  //    [ { rule: 'string',
  //        params: true,
  //        message: 'The members.2.name must be a string.' } ],
  //   'members.1.email':
  //    [ { rule: 'required',
  //        params: true,
  //        message: 'The members.1.email field is required.' },
  //      { rule: 'email',
  //        params: true,
  //        message: 'The members.1.email must be a valid email address.' } ],
  //   'members.2.email':
  //    [ { rule: 'email',
  //        params: true,
  //        message: 'The members.2.email must be a valid email address.' } ] }
}
```

I think that the concept of **"powerful"** will be transmitted.

