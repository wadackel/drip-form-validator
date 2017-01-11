import Validator from "./";
import { isArray } from "./utils";

const makeRuleTester = (assert, ruleName) => ((tests, bool) => {
  tests.forEach(test => {
    const isArrayValue = isArray(test);
    const value = isArrayValue ? test[0] : test;
    const params = isArrayValue ? test[1] : true;
    const v = new Validator({
      key: value
    }, {
      key: [{ [ruleName]: params }]
    });

    assert(v.validate() === bool, `${ruleName}#${value}(${params}) = ${bool}`);
  });
});

export default makeRuleTester;
