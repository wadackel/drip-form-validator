# Custom Normalizers

## Basic usage

Here is an example of registering a Normalizer called `"example"`.

### Register custom normalizer

Registering Normalizer uses the `registerNormalizer()` method.

```javascript
Validator.registerNormalizer('example', {}, (value, params, previousValue, values, previousValues) => {
  return parseInt(value, 10);
});
```

`registerNormalizer()` has the following structure.

```typescript
registerNormalizer(name: string, depends: NormalizerDepends, normalizer: Normalizer, before: boolean = true): void
```

`Normalizer` has the following structure. It takes the same arguments as [Inline normalizer](normalize.html#inline-normalizer).

```typescript
(value: any, params: NormalizeParams, previousValue: any, values: Values, previousValues: Values): any;
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
Validator.registerNormalizer('example', {}, (value, params, previousValue, values, previousValues) => {
  return parseInt(value, params.radix || 10);
});
```


### Dependence on other normalizers

As with [custom rules](custom-rules.html#dependence-on-other-rules) it is possible to dependence on other Normalizers.

In the following example, whitespace removed values are passed.

```javascript
Validator.registerNormalizer('example', { trim: true }, (value, params, previousValue, values, previousValues) => {
  return parseInt(value, params.radix || 10);
});
```


### Execution timing

By default Normalize is executed just before validation.  
However, there may be cases where you want to execute after validation.

It can be executed after validation by passing `false` as the last argument of `registerNormalizer()`.

```javascript
Validator.registerNormalizer('example', { trim: true }, (value, params, previousValue, values, previousValues) => {
  return parseInt(value, params.radix || 10);
}, false);
```

By the way, Inline normalizer is always executed before validation.


## Written test for Custom normalizers

TODO

