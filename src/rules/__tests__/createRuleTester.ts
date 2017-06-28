import { Validator } from '../../';
import { hasProp } from '../../internal/utils';

export interface RuleTest {
  value: any;
  params?: any;
}

const createRuleTester = (ruleName: string, autoImplicitTest: boolean = true) => ((result: boolean, tests: RuleTest[]) => {
  const rule = Validator.getRule(ruleName);
  const implicit = rule ? rule.implicit : false;

  // Implicit testing (key does not exist or null)
  if (result && autoImplicitTest) {
    const v = new Validator({}, { key: { [ruleName]: true } });
    expect(v.validate()).toBe(implicit);

    v.setValue('key', null);
    expect(v.validate()).toBe(implicit);
  }

  // Specified values
  tests.forEach(test => {
    const params = hasProp(test, 'params') ? test.params : true;
    const v = new Validator({
      key: test.value,
    }, {
      key: { [ruleName]: params },
    });

    expect(v.validate()).toBe(result);
  });
});

export default createRuleTester;
