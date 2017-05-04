import Validator, { RuleParams } from './validator';
import { hasProp } from './internal/utils';

export interface RuleTest {
  value: any;
  params?: RuleParams;
}

const createRuleTester = (assert: any, ruleName: string, autoImplicitTest: boolean = true) => ((expect: boolean, tests: RuleTest[]) => {
  const rule = Validator.getRule(ruleName);
  const implicit = rule ? rule.implicit : false;

  // Implicit testing (key does not exist or null)
  if (expect && autoImplicitTest) {
    const msg = `Implicit testing ${ruleName}`;
    const v = new Validator({}, { key: { [ruleName]: true } });
    assert(v.validate() === implicit, msg);

    v.setValue('key', null);
    assert(v.validate() === implicit, msg);
  }

  // Specified values
  tests.forEach(test => {
    const params = hasProp(test, 'params') ? <RuleParams>test.params : true;
    const v = new Validator({
      key: test.value,
    }, {
      key: { [ruleName]: params },
    });

    let prettyParams = '';

    try {
      prettyParams = JSON.stringify(params);
    } catch (e) {
      prettyParams = `${params}`;
    }

    assert(v.validate() === expect, `'${ruleName}' ${test.value} (${prettyParams}) = ${expect}`);
  });
});

export default createRuleTester;
