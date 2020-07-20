/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getS3ObjectKeyFromURL, stripFileExtension } from './helpers';

describe('getObjectKeyFromURL', () => {
  it('should work as expected', () => {
    // @ts-expect-error
    expect(getS3ObjectKeyFromURL()).toBe(null);

    expect(
      getS3ObjectKeyFromURL(
        'https://someoriginhere.cloudfront.net/record/56936/attachment/ec33c772b528748acbdb6c7eecab0b6b.mp4'
      )
    ).toBe('record/56936/attachment/ec33c772b528748acbdb6c7eecab0b6b.mp4');

    expect(
      getS3ObjectKeyFromURL(
        'https://someoriginhere.cloudfront.net/record/56936/attachment/ec33c772b528748acbdb6c7eecab0b6b'
      )
    ).toBe('record/56936/attachment/ec33c772b528748acbdb6c7eecab0b6b');

    expect(
      getS3ObjectKeyFromURL(
        'https://someoriginhere.cloudfront.net/assets/84.92c07606f876cca90db2.js'
      )
    ).toBe('assets/84.92c07606f876cca90db2.js');

    expect(
      getS3ObjectKeyFromURL(
        'someoriginhere.cloudfront.net/assets/84.92c07606f876cca90db2.js'
      )
    ).toBe(null);

    expect(getS3ObjectKeyFromURL('')).toBe(null);
  });
});

describe('getURLWithoutFileExtension', () => {
  it('should work as expected', () => {
    // @ts-expect-error
    expect(stripFileExtension()).toBe(null);

    expect(
      stripFileExtension(
        'https://someoriginhere.cloudfront.net/assets/84.92c07606f876cca90db2.js'
      )
    ).toBe(
      'https://someoriginhere.cloudfront.net/assets/84.92c07606f876cca90db2'
    );

    expect(
      stripFileExtension(
        'https://someoriginhere.cloudfront.net/assets/84.92c07606f876cca90db2'
      )
    ).toBe('https://someoriginhere.cloudfront.net/assets/84');

    expect(
      stripFileExtension('https://someoriginhere.cloudfront.net/assets/84')
    ).toBe('https://someoriginhere.cloudfront.net/assets/84');
  });
});

describe('getObjectKeyFromURL & getURLWithoutFileExtension together', () => {
  it('should work as expected', () => {
    expect(
      getS3ObjectKeyFromURL(
        stripFileExtension(
          'https://someoriginhere.cloudfront.net/assets/84.92c07606f876cca90db2.js'
        )
      )
    ).toBe('assets/84.92c07606f876cca90db2');
  });
});
