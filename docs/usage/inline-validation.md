# Inline validation

Passing the function to the rule you can make it work as an immediate validation rule.

Inline validation is useful for cases where your application already has its own validation logic, or if it is not versatile.


## Example

First of all, please see an example.

```javascript
import { Validator } from 'drip-form-validator';

// Token validator
const isValidToken = token => token === process.env.TOKEN;

const data = {
  token: '123456789',
};

const v = new Validator(data, {
  token: {
    required: true,
    isValidToken, // inline validation.
  },
});

if (v.validate()) {
  // `data` is valid.

} else {
  console.log(v.getAllErrors());
  // { token:
  //   [ { rule: 'isValidToken',
  //     params: [Function: isValidToken],
  //     message: 'The token field is invalid.' } ] }
}
```

It is almost the same as specifying a rule name.


## Function structure

The structure of the function that can be passed to InlineValidation is as follows.

```typescript
(value: any, params: RuleParams, field: string, values: Values): boolean | string;
```

You can customize the error message by returning a `string` rather than a `boolean`.

```javascript
const isValidToken = token => token === process.env.TOKEN ? true : 'Token is invalid!';

// ...

console.log(v.getAllErrors());
// { token:
//    [ { rule: 'isValidToken',
//        params: [Function: isValidToken],
//        message: 'Token is invalid!' } ] }
```

