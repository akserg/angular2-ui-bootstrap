import {describe, expect} from 'angular2/testing';

import {VisibleEffect} from './visible-effect';
import {CssEffectTiming} from './css-effect-timing';

describe('VisibleEffect', () => {

  let visibleEffect:VisibleEffect;
  let element:HTMLElement;

  beforeEach(() => {
    visibleEffect = new VisibleEffect();
    element = document.createElement('div');
  });

  it('should be fine', () => {
  	expect(visibleEffect).toBeDefined();
  });

  it('should return 0 on call startShow', () => {
  	expect(visibleEffect.startShow(element, 0, CssEffectTiming.LINEAR)).toBe(0);
  });

  it('should return 0 on call startHide', () => {
  	expect(visibleEffect.startHide(element, 0, CssEffectTiming.LINEAR)).toBe(0);
  });

  it('should return null on call computeFractionComplete', () => {
  	expect(visibleEffect.computeFractionComplete(element)).toBe(null);
  });

  it('should return NoOpVisibleEffect on call default static method without VisibleEffect in attributes', () => {
  	expect(VisibleEffect.default()).toBe(VisibleEffect.NoOpVisibleEffect);
  });
});
