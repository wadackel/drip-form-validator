## 0.0.7

> 2017-08-30

* Update dependencies & devDependencies


## 0.0.6

> 2017-07-28

* Remove warnings that occur during installation
    - Originally unnecessary, `@types/date-fns` has been removed from dependency.
* Support for validator@8.x
    - The treatment of `isURL()` has changed. Please check [CHANGELOG](https://github.com/chriso/validator.js/blob/master/CHANGELOG.md#800) of [validator.js](https://github.com/chriso/validator.js) for details.
* Update dependencies & devDependencies


## 0.0.5

> 2017-07-02

* Update `dot-wild`


## 0.0.4

> 2017-07-02

* Update dependencies & devDependencies


## 0.0.3

> 2017-06-28

* Switch to `jest` from `mocha` + `power-assert`
* Fix execution timing of `mapArgsToParams`
    - To be able to access the instance information after setting the rule.
* Change filename (internal)
* Fix build tasks
* Add coverage report
* Fix typo in docs


## 0.0.2

> 2017-06-23

### New rules

* `betweenWith`
* `maxWith`
* `minWith`


### Others

* Support to labels error messages referring to foreign keys
* Add instance to the argument of `mapArgsToParams`
* Update devDependencies


## 0.0.1

> 2017-06-16

* First release

