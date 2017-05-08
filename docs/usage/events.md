# Events

drip-form-validator is a class that inherits `EventEmitter`.  
You can listen to several events.

```javascript
import { Validator, EventTypes } from 'drip-form-validator';

const v = new Validator();

v.on(EventTypes.BEFORE_VALIDATE, (validator) => {
  // before validation.
});

v.on(EventTypes.AFTER_VALIDATE, (validator) => {
  // after validation.
});

v.on(EventTypes.VALID, (validator) => {
  // after validation, when data is valid.
});

v.on(EventTypes.INVALID, (validator) => {
  // after validation, when data is invalid.
});

v.validate();
```

Validator instances are passed as arguments to any events.

