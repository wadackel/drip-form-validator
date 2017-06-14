# Custom Normalizers

## Basic usage

Here is an example of registering a Normalizer called `"example"`.


### Register custom normalizer

Registering Normalizer uses the `registerNormalizer()` method.

```javascript
Validator.registerNormalizer('example', (value, params, previousValue, values, previousValues) => {
  return parseInt(value, 10);
});
```

`registerNormalizer()` has the following structure.

```typescript
registerNormalizer(name: string, normalizer: Normalizer, options: BuiltinNormalizerOptions = {}): void
```

`Normalizer` has the following structure. It takes the same arguments as [Inline normalizer](normalize.html#inline-normalizer).

```typescript
(value: any, params: NormalizeParams, previousValue: any, values: Values, previousValues: Values): any;
```

`BuiltinNormalizerOptions` is an object with the following structure.

```typescript
{
  depends?: NormalizerDepends;
  override?: boolean;
}
```


### Custom normalizer usage

Registered normalizers can be used like any other normalizer.

```javascript
const v = new Validator(data, rules, {
  normalizers: {
    fieldName: {
      // Registered your normalizers
      example: true,
    },
  },
});
```


## Advanced usage

### Passing parameters

Let's pass parameters so that we can adjust the radix of `"example"` earlier.

```javascript
{
  normalizers: {
    fieldName: {
      example: { radix: 16 }
    }
  }
}
```

Pass the parameters to `params`.

```javascript
Validator.registerNormalizer('example', (value, params, previousValue, values, previousValues) => {
  return parseInt(value, params.radix || 10);
});
```


### Dependence on other normalizers

As with [custom rules](custom-rules.html#dependence-on-other-rules) it is possible to dependence on other Normalizers.

In the following example, whitespace removed values are passed.

```javascript
Validator.registerNormalizer('example', (value, params, previousValue, values, previousValues) => {
  return parseInt(value, params.radix || 10);
}, {
  depends: { trim: true },
});
```


### Override builtin normalizers

You may want to override the normalizers provided by `drip-form-validator`.  
In such a case the `override` option is useful.

```javascript
Validator.registerNormalizer('toString', (value, params, previousValue, values, previousValues) => {
  /* override normalizer specification */
}, {
  override: true,
});
```

An error will occur if you normally try to register a normalizer with the same name.  
You can override built-in normalizers by enabling `override` option.


## Written test for Custom normalizers

TODO

