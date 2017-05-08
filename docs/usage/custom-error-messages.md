# Custom Error Messages

The drip-form-validator provides an error message by default.  
However, I think that customization is necessary for each application in most cases.

There are two approaches to customizing error messages.  
(Of course you can use it together with two.)


## Cusom field name

Field names can be customized using the `fields` option. This is the simplest customization.

```javascript
const data = { email: 'foo' };
const rules = { email: { email: true } };
const options = {
  fields: {
    email: 'Email-Address',
  },
};

const v = new Validator(data, rules, options);

v.validate();

console.log(v.getErrorMessages('email'));
// [ 'The Email-Address must be a valid email address.' ]
```



## Custom Messages

If you need to customize the message to completely different things, use the `messages` option.

```javascript
const data = { title: (new Array(257)).join('a') };

const rules = {
  title: {
    required: true,
    max: { max: 255 },
  },
};

const options = {
  messages: {
    title: {
      required: 'The Title is required...',
      max: 'The Title is too long...',
    },
  },
};

const v = new Validator(data, rules, options);

v.validate();

console.log(v.getErrorMessages('title'));
// [ 'The Title is too long...' ]
```


---

I think that the concept of **"customizable"** will be transmitted.

