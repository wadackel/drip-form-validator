import createNormalizeTester from './createNormalizeTester';

const normalizer = 'toDate';
const tester = createNormalizeTester(normalizer);

describe(`Normalizers#${normalizer}`, () => {
  it('Should be normalize', () => {
    const date = new Date();

    tester([
      { value: null, params: true, expect: null },
      { value: undefined, params: true, expect: undefined },
      { value: 0, params: true, expect: 0 },
      { value: 2017, params: true, expect: 2017 },
      { value: '2017-02-01', params: true, expect: new Date('2017-02-01 00:00:00') },
      { value: '2017-12-03 10:20:30', params: true, expect: new Date('2017-12-03 10:20:30') },
      { value: date, params: true, expect: date },
    ]);
  });
});
