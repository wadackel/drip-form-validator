# Error manipulate

After executing the validation, it is important to display the error in an easy-to-understand manner or output it to the log.
The drip-form-validator can manipulate the error flexibly according to the purpose.

Errors are kept in the instance after the verification is done.


## Get all errors

Returns an object with field name as key.  
In addition to the message, there are information such as parameters and validation rule names in the error.

```javascript
v.getAllErrors();

// =>
// {
//   field1: [
//     { rule: 'ruleName1', params: true, message: 'Error Message' },
//     { rule: 'ruleName2', params: true, message: 'Error Message' },
//   ],
//   field2: [
//     { rule: 'ruleName1', params: true, message: 'Error Message' },
//   ],
//   ...
// }
```

If no error exists, it returns an **empty object**, so the following code does not do what you expected.

```javascript
if (!v.getAllErrors()) {
  // valid
} else {
  // invalid
}
```

Please use `isValid()` instead to check that there are no errors.

```javascript
if (v.isValid()) {
  // valid
} else {
  // invalid
}
```


## Get all error messages

`getAllErrorMessages()` is useful to retrieve messages with fields as keys.  
Information on parameters and rules is omitted.

```javascript
v.getAllErrorMessages();

// =>
// {
//   field1: [
//     'Error Message',
//     'Error Message',
//   ],
//   field2: [
//     'Error Message',
//   ],
//   ...
// }
```

Like `getAllErrors()`, if there is no error, it returns an empty object.


## Get field errors

You can retrieve errors for the specified field separately.  

```javascript
v.getErrors('fieldName');

// =>
// [
//   { rule: 'ruleName1', params: true, message: 'Error Message' },
//   { rule: 'ruleName2', params: true, message: 'Error Message' },
// ]
```

If there is no error, it returns `null`.


## Get field error messages

Only get `message` of `getErrors()` result.

```javascript
v.getErrorMessages('fieldName');

// =>
// ['Error Message 1', 'Error Message 2']
```


## Clear errors

You can clear the errors held by the instance.

```javascript
v.clearAllErrors();
v.clearErrors('fieldName');
```


---


There are several other manipulate methods. Please refer to the [API Document](https://tsuyoshiwada.github.io/drip-form-validator/api/) for details.
