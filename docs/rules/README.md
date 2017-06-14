# Builtin Rules

* [`after`](#after)
* [`alpha`](#alpha)
* [`alphaDash`](#alphadash)
* [`alphaNumeric`](#alphanumeric)
* [`array`](#array)
* [`before`](#before)
* [`between`](#between)
* [`date`](#date)
* [`dateFormat`](#dateformat)
* [`different`](#different)
* [`email`](#email)
* [`equals`](#equals)
* [`falsy`](#falsy)
* [`float`](#float)
* [`format`](#format)
* [`in`](#in)
* [`integer`](#integer)
* [`lowercase`](#lowercase)
* [`max`](#max)
* [`min`](#min)
* [`natural`](#natural)
* [`notIn`](#notin)
* [`number`](#number)
* [`numeric`](#numeric)
* [`object`](#object)
* [`present`](#present)
* [`required`](#required)
* [`same`](#same)
* [`size`](#size)
* [`string`](#string)
* [`time`](#time)
* [`truthy`](#truthy)
* [`uppercase`](#uppercase)
* [`url`](#url)


## `after`

It checks that it is after the specified date.

**Parameters:**

* `string | number | Date`

**Example:**

```javascript
{
  after: new Date(),
}
```


## `alpha`

Must be entirely alphabetic characters.

**Parameters:**

* None

**Example:**

```javascript
{
  alpha: true,
}
```


## `alphaDash`

Must be alphabetic characters and dashes and underscores.

**Parameters:**

* None

**Example:**

```javascript
{
  alphaDash: true,
}
```


## `alphaNumeric`

Must be alphanumeric and underscore and dash.

**Parameters:**

* None

**Example:**

```javascript
{
  alphaNumeric: true,
}
```


## `array`

Check if the value is Array.

**Parameters:**

* None

**Example:**

```javascript
{
  array: true,
}
```


## `before`

It checks that it is before the specified date.

**Parameters:**

* `string | number | Date`

**Example:**

```javascript
{
  before: new Date(),
}
```


## `between`

For character strings and arrays, check the `length` attribute, if it is a number, check that the value is within the specified range.

**Parameters:**

* `min`: `number`
* `max`: `number`

**Example:**

```javascript
{
  between: {
    min: 10,
    max: 20,
  },
}
```


## `date`

Check if the value is Date.

**Parameters:**

* None

**Example:**

```javascript
{
  date: true,
}
```


## `dateFormat`

It checks whether the value matches the specified date format.

**Parameters:**

* `string`

**Example:**

```javascript
{
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
}
```

**Reference:**

* https://date-fns.org/docs/format


## `different`

It checks whether the specified field and value are different.

**Parameters:**

* `string`

**Example:**

```javascript
{
  different: 'otherField',
}
```


## `email`

Check that the email address format.

**Parameters:**

* None

**Example:**

```javascript
{
  email: true,
}
```


## `equals`

It checks whether it matches the specified value.

**Parameters:**

* `any`

**Example:**

```javascript
{
  equals: 'Foo',
}
```


## `falsy`

Check if the value is falsy.

**Valid:**

* `false`
* `"false"`
* `0`
* `"0"`
* `"NO"` (`"No"`, `"no"`)

**Parameters:**

* None

**Example:**

```javascript
{
  falsy: true,
}
```


## `float`

Check if the value is a float number.

**Parameters:**

* None

**Example:**

```javascript
{
  float: true,
}
```


## `format`

It checks whether it conforms to the specified format.

**Parameters:**

* `RegExp`

**Example:**

```javascript
{
  format: /^foo.*bar$/,
}
```


## `in`

It checks whether the same value exists in the specified array.

**Parameters:**

* `any[]`

**Example:**

```javascript
{
  in: ['foo', 'bar', 'baz'],
}
```


## `integer`

Check if the value is a integer.

**Parameters:**

* None

**Example:**

```javascript
{
  integer: true,
}
```


## `lowercase`

Check if the value is a lowercase.

**Parameters:**

* None

**Example:**

```javascript
{
  lowercase: true,
}
```


## `max`

For character strings and arrays, check the `length` attribute, for numeric values, check that the value does not exceed the specified number.

**Parameters:**

* `number`

**Example:**

```javascript
{
  max: 120,
}
```


## `min`

For character strings and arrays, check the length attribute, and for numeric values, check that the value exceeds the specified number.

**Parameters:**

* `number`

**Example:**

```javascript
{
  min: 24,
}
```


## `natural`

Check if the value is a natural number.  
By default `0` returns `true`, but invalidates `0` by passing `false` to `disallowZero`.

**Parameters:**

* `disallowZero?`: `boolean`

**Example:**

```javascript
{
  natural: { disallowZero: true },
}
```


## `notIn`

It checks whether the same value not exists in the specified array.

**Parameters:**

* `any[]`

**Example:**

```javascript
{
  notIn: ['foo', 'bar', 'baz'],
}
```


## `number`

Check if the value is number.

**Parameters:**

* None

**Example:**

```javascript
{
  number: true,
}
```


## `numeric`

Check if the value is numeric.

**Parameters:**

* None

**Example:**

```javascript
{
  numeric: true,
}
```


## `object`

Check if the value is plain object.

**Parameters:**

* None

**Example:**

```javascript
{
  object: true,
}
```


## `present`

It checks whether the field exists, but it pass even if the value is empty.

**Parameters:**

* None

**Example:**

```javascript
{
  present: true,
}
```


## `required`

Check the field exists and the value is not empty.

**Parameters:**

* None

**Example:**

```javascript
{
  required: true,
}
```


## `same`

It checks whether the specified field and value are same.

**Parameters:**

* `string`

**Example:**

```javascript
{
  same: 'otherField',
}
```


## `size`

For character strings and arrays, check the `length` attribute, if it is a number, check that the value is match the specified number.

**Parameters:**

* `number`

**Example:**

```javascript
{
  size: 48,
}
```


## `string`

Check if the value is string.

**Parameters:**

* None

**Example:**

```javascript
{
  string: true,
}
```


## `time`

Check if the time is in the correct format. (Format: "HH:mm:ss")

**Parameters:**

* None

**Example:**

```javascript
{
  time: true,
}
```


## `truthy`

Check if the value is truthy.

**Valid:**

* `true`
* `"true"`
* `"YES"` (`"Yes"`, `"yes"`)
* `1`
* `"1"`

**Parameters:**

* None

**Example:**

```javascript
{
  truthy: true,
}
```


## `uppercase`

Check if the value is a uppercase.

**Parameters:**

* None

**Example:**

```javascript
{
  uppercase: true,
}
```


## `url`

Check if the value is valid URL format.

**Parameters:**

* `protocols`: `string[]`
* `require_protocol`: `boolean`
* `require_tld`: `boolean`
* `require_host`: `boolean`
* `require_valid_protocol`: `boolean`
* `allow_underscores`: `boolean`
* `host_whitelist`: `boolean`
* `host_blacklist`: `boolean`
* `allow_trailing_dot`: `boolean`
* `allow_protocol_relative_urls`: `boolean`

**Example:**

```javascript
{
  url: true,
}

// -- or --

{
  url: {
    protocols: ['http','https','ftp'],
    require_protocol: true,
    require_tld: true,
    require_host: true,
    require_valid_protocol: true,
    allow_underscores: false,
    host_whitelist: false,
    host_blacklist: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false,
  },
}
```

**Reference:**

* [validator.js - `isURL()`](https://github.com/chriso/validator.js)
