import {
  describe,
  expect
} from 'angular2/testing';

import {iteratorToArray} from './to-array';

describe('toArray', () => {

  it('should convert Iterator into Array', () => {
    let map:Map<string, string> = new Map<string, string>();
    map.set('1', 'first');
    map.set('2', 'second');

    let array:Array<string> = iteratorToArray(map.keys());

  	expect(array).toBeDefined();
    expect(array.length).toBe(2);
    expect(array[0]).toBe('1');
    expect(array[1]).toBe('2');
  });
});
