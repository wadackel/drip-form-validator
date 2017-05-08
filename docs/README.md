# drip-form-validator Documentation

drip-form-validator has the following features.

* Simple and Powerful and Customizable.
* Support Asynchronous validation.
* Support validation of intuitive array.
* Support normalize values.
* Support l18n. (welcome PRs!)
* Written by TypeScript.


## Installation

To install the stable version.

```bash
$ npm install drip-form-validator
```


## Basic usage

Usage is very simple !

```javascript
import { Validator } from 'drip-form-validator';

const v = new Validator(/* ... */);

v.validate();
```


## Documentation

* [Usage](usage/README.md)
* [Builtin Rules](rules/README.md)
* [Builtin Normalizers](normalizers/README.md)
* [API Document](https://tsuyoshiwada.github.io/drip-form-validator/api/)
* [CHANGELOG](https://github.com/tsuyoshiwada/drip-form-validator/blob/master/CHANGELOG.md)



## Contribute

1. Fork it!
1. Create your feature branch: git checkout -b my-new-feature
1. Commit your changes: git commit -am 'Add some feature'
1. Push to the branch: git push origin my-new-feature
1. Submit a pull request :D

Bugs, feature requests and comments are more than welcome in the [issues](https://github.com/tsuyoshiwada/drip-form-validator/issues).



## License

MIT © tsuyoshiwada

