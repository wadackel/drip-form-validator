# Asynchronous validation

drip-form-validator is asynchronous validation can be implemented easily.  
Asynchronous correspondence can be realized in two steps.

1. Use `asyncValidate()` instead of `validate()`.
2. Return `Promise` with validation rule.

```javascript
import { Validator } from 'drip-form-validator';

const checkAccountExists = email => new Promise((resolve, reject) => (
  // valid   => resolve();
  // invalid => reject('Account does not exist!'); // message is optional.
));

const data = {
  email: 'foo@bar.com',
};

const v = new Validator(data, {
  email: {
    required: true,
    email: true,
    checkAccountExists, // asynchronous validation
  },
});

// `asyncValidate()` returns Promise.
v.asyncValidate()
  .then(values => {
    console.log(values);
    // valid values.
  })
  .catch(errors => {
    console.log(errors);
    // { email:
    //    [ { rule: 'checkAccountExists',
    //        params: [Function: checkAccountExists],
    //        message: 'Account does not exist!' } ] }
  });
```


## Get status

In some cases, it may be necessary to decide whether or not it is being verified by performing asynchronous verification.  
You can judge whether it is being verified by using `isValidating()`.

```javascript
if (v.isValidating()) {
  // validating...
}
```
