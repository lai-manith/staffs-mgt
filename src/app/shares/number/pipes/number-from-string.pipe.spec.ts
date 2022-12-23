import { NumberFromStringPipe } from './number-from-string.pipe';

describe('NumberFromStringPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberFromStringPipe();
    expect(pipe).toBeTruthy();
  });
});
