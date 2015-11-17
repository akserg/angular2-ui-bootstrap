import {describe, beforeEach, expect, it, fakeAsync, tick} from 'angular2/testing';

import {ShrinkEffect} from './shrink-effect';
import {CssEffectTiming} from './css-effect-timing';
import {Orientation} from '../utils/alignment';

describe('Vertical ShrinkEffect', () => {
  let property;
  let timing;
  let cssTimingValue;
  let desiredDuration;
  let element:HTMLElement;
  let shrinkEffect:ShrinkEffect;

  beforeEach(() => {
    property = 'max-height';
    timing = CssEffectTiming.LINEAR;
    cssTimingValue = CssEffectTiming.getCssValue(timing);
    desiredDuration = 50;
    element = document.createElement('div');
    shrinkEffect = new ShrinkEffect(Orientation.VERTICAL);
  });

  it('should be defined', () => {
  	expect(shrinkEffect).toBeDefined();
  });
  
  it('should update style of element after call startShow', () => {
    fakeAsync(() => {
      let actualDuration = shrinkEffect.startShow(element, desiredDuration, timing);

      expect(actualDuration).toBe(desiredDuration);

      expect(element.style.transitionTimingFunction).not.toBe(cssTimingValue);
      expect(element.style.transitionProperty).not.toBe(property);
      expect(element.style.transitionDuration).not.toBe(desiredDuration + 'ms');

      tick(1);

      expect(element.style.transitionTimingFunction).toBe(cssTimingValue);
      expect(element.style.transitionProperty).toBe(property);
      expect(element.style.transitionDuration).toBe(desiredDuration + 'ms');
    })();
  });
  
  it('should update style of element after call startHide', () => {
    fakeAsync(() => {
      let actualDuration = shrinkEffect.startHide(element, desiredDuration, timing);

      expect(actualDuration).toBe(desiredDuration);

      expect(element.style.transitionTimingFunction).not.toBe(cssTimingValue);
      expect(element.style.transitionProperty).not.toBe(property);
      expect(element.style.transitionDuration).not.toBe(desiredDuration + 'ms');

      tick(1);

      expect(element.style.transitionTimingFunction).toBe(cssTimingValue);
      expect(element.style.transitionProperty).toBe(property);
      expect(element.style.transitionDuration).toBe(desiredDuration + 'ms');
    })();
  });
  
  it('should clean style of element after call clearAnimation', () => {
    fakeAsync(() => {
      shrinkEffect.startShow(element, desiredDuration, timing);

      tick(1);

      expect(element.style.transitionTimingFunction).toBe(cssTimingValue);
      expect(element.style.transitionProperty).toBe(property);
      expect(element.style.transitionDuration).toBe(desiredDuration + 'ms');

      shrinkEffect.clearAnimation(element);

      tick(1);

      expect(element.style.transitionTimingFunction).not.toBe(cssTimingValue);
      expect(element.style.transitionProperty).not.toBe(property);
      expect(element.style.transitionDuration).not.toBe(desiredDuration + 'ms');
    })();
  });
});

describe('Horizontal ShrinkEffect', () => {
  let property;
  let timing;
  let cssTimingValue;
  let desiredDuration;
  let element:HTMLElement;
  let shrinkEffect:ShrinkEffect;

  beforeEach(() => {
    property = 'max-width';
    timing = CssEffectTiming.LINEAR;
    cssTimingValue = CssEffectTiming.getCssValue(timing);
    desiredDuration = 50;
    element = document.createElement('div');
    shrinkEffect = new ShrinkEffect(Orientation.HORIZONTAL);
  });

  it('should be defined', () => {
  	expect(shrinkEffect).toBeDefined();
  });
  
  it('should update style of element after call startShow', () => {
    fakeAsync(() => {
      let actualDuration = shrinkEffect.startShow(element, desiredDuration, timing);

      expect(actualDuration).toBe(desiredDuration);

      expect(element.style.transitionTimingFunction).not.toBe(cssTimingValue);
      expect(element.style.transitionProperty).not.toBe(property);
      expect(element.style.transitionDuration).not.toBe(desiredDuration + 'ms');

      tick(1);

      expect(element.style.transitionTimingFunction).toBe(cssTimingValue);
      expect(element.style.transitionProperty).toBe(property);
      expect(element.style.transitionDuration).toBe(desiredDuration + 'ms');
    })();
  });
  
  it('should update style of element after call startHide', () => {
    fakeAsync(() => {
      let actualDuration = shrinkEffect.startHide(element, desiredDuration, timing);

      expect(actualDuration).toBe(desiredDuration);

      expect(element.style.transitionTimingFunction).not.toBe(cssTimingValue);
      expect(element.style.transitionProperty).not.toBe(property);
      expect(element.style.transitionDuration).not.toBe(desiredDuration + 'ms');

      tick(1);

      expect(element.style.transitionTimingFunction).toBe(cssTimingValue);
      expect(element.style.transitionProperty).toBe(property);
      expect(element.style.transitionDuration).toBe(desiredDuration + 'ms');
    })();
  });
  
  it('should clean style of element after call clearAnimation', () => {
    fakeAsync(() => {
      shrinkEffect.startShow(element, desiredDuration, timing);

      tick(1);

      expect(element.style.transitionTimingFunction).toBe(cssTimingValue);
      expect(element.style.transitionProperty).toBe(property);
      expect(element.style.transitionDuration).toBe(desiredDuration + 'ms');

      shrinkEffect.clearAnimation(element);

      tick(1);

      expect(element.style.transitionTimingFunction).not.toBe(cssTimingValue);
      expect(element.style.transitionProperty).not.toBe(property);
      expect(element.style.transitionDuration).not.toBe(desiredDuration + 'ms');
    })();
  });
});