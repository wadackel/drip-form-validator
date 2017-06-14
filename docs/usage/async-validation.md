# Asynchronous validation

drip-form-validator is asynchronous validation can be implemented easily.  
Asynchronous correspondence can be realized next steps.

1. Register a test that returns Promise using the `registerAsync()` method.
2. Use `asyncValidate()` instead of `validate()`.

```javascript
import { Validator } from 'drip-form-validator';

// Simulate the API call
Validator.registerAsyncRule('checkAccountExists', email => (
  new Promise((resolve, reject) => (
    setTimeout(() => (
      email === 'example@mail.com' ? resolve() : reject('Account does not exist!')
    ), 1000)
  ))
));

const data = {
  email: 'foo@bar.com',
};

const v = new Validator(data, {
  email: {
    checkAccountExists: true,
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
    //        params: true,
    //        message: 'Account does not exist!' } ] }
  });
```

**Note:**

The `asyncValidate()` method only performs asynchronous testing.  
The following tests will not be executed.

* Synchronization validations
* Inline validation

Let's use the `validate()` method as necessary.


## Get status

In some cases, it may be necessary to decide whether or not it is being verified by performing asynchronous verification.  
You can judge whether it is being verified by using `isValidating()`.

```javascript
if (v.isValidating()) {
  // validating...
}
```
