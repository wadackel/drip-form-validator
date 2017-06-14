# Builtin Normalizers

* [`between`](#between)
* [`betweenWith`](#betweenwith)
* [`escape`](#escape)
* [`lowercase`](#lowercase)
* [`ltrim`](#ltrim)
* [`max`](#max)
* [`maxWith`](#maxwith)
* [`min`](#min)
* [`minWith`](#minwith)
* [`numberWithCommas`](#numberwithcommas)
* [`rtrim`](#rtrim)
* [`toBoolean`](#toboolean)
* [`toDate`](#todate)
* [`toFloat`](#tofloat)
* [`toInt`](#toint)
* [`toString`](#tostring)
* [`unescape`](#unescape)
* [`uppercase`](#uppercase)


## `between`

Normalize the value to the specified range.

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


## `betweenWith`

Normalize the value to the specified range with other field values.

**Parameters:**

* `min`: `string`
* `max`: `string`

**Example:**

```javascript
{
  between: {
    min: 'minKey',
    max: 'maxKey',
  },
}
```


## `escape`

Replace `<`, `>`, `&`, `'`, `"` and `/` with HTML entities.

**Parameters:**

* None

**Example:**

```javascript
{
  escape: true,
}
```

**Reference:**

* [validator.js - `escape()`](https://github.com/chriso/validator.js)


## `lowercase`

Replace the character string with lowercase letters.

**Parameters:**

* None

**Example:**

```javascript
{
  lowercase: true,
}
```


## `ltrim`

Trim characters from the left-side of the input.

**Parameters:**

* `string`

**Example:**

```javascript
{
  ltrim: true,

  // -- or --

  ltrim: '@',
}
```


## `max`

Normalize the value to less than or equal to the specified number.

**Parameters:**

* `number`

**Example:**

```javascript
{
  max: 100,
}
```


## `maxWith`

Normalize the value to less than or equal to the specified field value.

**Parameters:**

* `string`

**Example:**

```javascript
{
  max: 'maxKey',
}
```


## `min`

Normalize the value to greater than or equal to the specified number.

**Parameters:**

* `number`

**Example:**

```javascript
{
  min: 100,
}
```


## `minWith`

Normalize the value to greater than or equal to the specified field value.

**Parameters:**

* `string`

**Example:**

```javascript
{
  min: 'minKey',
}
```


## `numberWithCommas`

Normalize to comma-separated numbers. (Example: `1,000,000`)

**Parameters:**

* None

**Example:**

```javascript
{
  numberWithCommas: true,
}
```


## `rtrim`

Trim characters from the right-side of the input.

**Parameters:**

* `string`

**Example:**

```javascript
{
  rtrim: true,

  // -- or --

  rtrim: '/',
}
```


## `toBoolean`

Converts a value to a Boolean.

**false:**

* `"0"`
* `"false"`
* falsy

**true:**

* truthy

**Parameters:**

* None

**Example:**

```javascript
{
  toBoolean: true,
}
```


## `toDate`

Converts a value to a Date.

**Parameters:**

* None

**Example:**

```javascript
{
  toDate: true,
}
```


## `toFloat`

Converts a value to a float number.

**Parameters:**

* None

**Example:**

```javascript
{
  toFloat: true,
}
```


## `toInt`

Converts a value to a integer.

**Parameters:**

* `radix?`: `number`

**Example:**

```javascript
{
  toInt: true,

  // -- or --

  toInt: { radix: 16 },
}
```


## `toString`

Converts a value to a string.

**Parameters:**

* None

**Example:**

```javascript
{
  toString: true,
}
```


## `unescape`

Replaces HTML encoded entities with `<`, `>`, `&`, `'`, `"` and `/`.

**Parameters:**

* None

**Example:**

```javascript
{
  unescape: true,
}
```


## `uppercase`

Replace the character string with uppercase letters.

**Parameters:**

* None

**Example:**

```javascript
{
  uppercase: true,
}
```
