# Normalize values

I think that it is common to trim a string before executing validation.

The drip-form-validator can naturally incorporate such Normalize.  
By default some Normalizers are provided. For details, please refer to [Builtin Normalizers](../normalizers/README.md).


## Basic usage

```javascript
const data = {
  id: '123456789',
  email: '\n example@email.com  \n',
  url: 'http://foobar.com/',
};

const v = new Validator(data, {/* rules */}, {
  normalizers: {
    id: {
      toInt: true,
    },
    email: {
      trim: true,
    },
    url: {
      trim: true,
      rtrim: { chars: '/' },
    },
  }
});

v.normalize();

console.log(v.getValues());
// {
//   id: 123456789,
//   email: 'example@email.com',
//   url: 'http://foobar.com'
// }
```

Usage is almost the same as specification of validation rule.  
Pass the object to the `normalizers` option in the following format:

```javascript
{
  field: {
    normalizerName: parameters
  }
}
```


## Inline Normalizer

It is also possible to specify it with Inline.

```javascript
const v = new Validator({
  key: '123',
}, {/* rules */}, {
  normalizers: {
    key: {
      inline: value => parseFloat(value) * 100,
    },
  },
});

v.normalize();

console.log(v.getValues());
// {
//   key: 12300
// }
```

The structure of the function is as follows.

```typescript
(value: any, params: NormalizeParams, previousValue: any, values: Values, previousValues: Values): any;
```

