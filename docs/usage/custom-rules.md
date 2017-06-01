# Custom Validation Rules

## Basic usage

### Register custom rule

Registering a custom rule uses the `registerRule()` method.

Below is an example of registering the custom rule `"example"`.

```javascript
import { Validator } from 'drip-form-validator';

Validator.registerRule('example', {}, (value, params, field, values) => {
  return value === 'foo';
});
```

`registerRule()` has the following structure.

```typescript
registerRule(rule: string, depends: RuleDepends, test: SyncValidationTester, implicit: boolean = true): void
```

`SyncValidationTester` has the following structure. It takes the same arguments as [Inline Validation](inline-validation.md).

```typescript
(value: any, params: RuleObjectParams, field: string, values: Values): boolean | string;
```

> **Tips:** Since all the built-in rules are defined using this `registerRule` method, it may be an implementation reference.

Please refer to [Asynchronous validation](./async-validation.md) for registration of asynchronous validations.


### Custom rule usage

Registered rules can be used like any other rule.

```javascript
const v = new Validator(data, {
  fieldName: {
    // Registered your rules
    example: true,
  },
});
```

You can see that registering custom rules is easy.


## Advanced usage

I could understand basic usage anymore.  
I will introduce the contents that I have stepped on from now on.


### Passing parameters

We tested the previous `"hoge"` rule to be consistent with `"foo"`.  
However, there are cases where you want to test `"bar"`.

In such a case it is a good solution to pass the parameters as follows.

```javascript
{
  fieldName: {
    example: { text: 'bar' }
  }
}
```

The passed parameters are passed to `params` of `registerRule()`.

```javascript
Validator.registerRule('example', {}, (value, params, field, values) => {
  return value === params.text;
});
```

With this, text comparison of various variations became possible.


### Dependence on other rules

For example, if you validate a form, I think that there will be more tests that premise character strings.  
Therefore, it is in vain to verify "whether it is a character string" or not.

There is already a built-in rule called `"string"`, so it is ideal to use it.  
It is possible for drip-form-validator.

Please pass a list of rules to the second argument of `registerRule()`.

```javascript
Validator.registerRule('example', { string: true }, (value, params, field, values) => {
  return value === params.text;
});
```

By doing this, the custom rule is executed only when the specified rule passes.  
If the specified rule does not pass, the custom rule is not executed and the test fails.

By successfully using dependency on rules, it will be possible to make DRY code.


### Implicit rules

Many rules are not tested in the following cases.

* Field does not exist (key does not exist)
* Value is `null`.

This is due to the effect of `implicit`. It is specified in the last argument of `registerRule()`.  
`true` is specified by default.

```javascript
Validator.registerRule('example', { string: true }, (value, params, field, values) => {
  return value === params.text;
}, true);
```

A rule that specifies `true` implicitly passes the test in the case mentioned above.  
If `false`, the test is executed in all cases.

For example, the existence of a key is used in uncertain rules etc. (`"required"` etc...)


## Written test for Custom rules

TODO

