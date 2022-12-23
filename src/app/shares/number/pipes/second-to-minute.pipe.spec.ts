import { SecondToMinutePipe } from './second-to-minute.pipe';

describe('SecondToMinutePipe', () => {
  it('create an instance', () => {
    const pipe = new SecondToMinutePipe();
    expect(pipe).toBeTruthy();
  });
});
