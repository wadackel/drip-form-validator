# Basic usage

I will describe the most basic example.  
I think that the concept of **"simple"** will be transmitted.

```javascript
import { Validator } from 'drip-form-validator';

const data = {
  title: 'Post title',
  body: null,
};

const v = new Validator(data, {
  title: {
    required: true,
    max: { max: 255 },
  },
  body: {
    required: true,
  },
});

if (v.validate()) {
  // `data` is valid.

} else {
  console.log(v.getAllErrors());
  // { body:
  //  [ { rule: 'required',
  //      params: true,
  //      message: 'The body field is required.' } ] }
}
```

Validation rules are specified in the following format.

```javascript
{
  field: {
    ruleName: parameters
  }
}
```

If you specify `false` or `null` for the parameter, validation will not be executed.

```javascript
const v = new Validation(data, {
  ...,
  body: {
    required: false,
  },
});
```

---

For API details of the constructor, please see [API Document](https://tsuyoshiwada.github.io/drip-form-validator/api/classes/_validator_.validator.html#constructor).

