import {describe, beforeEach, expect, it, fakeAsync, tick, flushMicrotasks} from 'angular2/testing';

import {VisibleEffectManager, VisibleState, VisibleResult, VisibleAction, AnimatingValues} from './visible-effect-manager';
import {VisibleEffect} from './visible-effect';
import {CssTransitionEffect} from './css-transition-effect';
import {CssEffectTiming} from './css-effect-timing';

describe('AnimatingValues', () => {
  
  let element:HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });
  
  it ('should schedule cleanup', () => {
    expect(AnimatingValues.isAnimating(element)).toBeFalsy();
    
    fakeAsync(() => {
      AnimatingValues.scheduleCleanup(1, element, (el) => {
        expect(el).toBe(element);
      }, (el) => {
        expect(el).toBe(element);
      });
      
      expect(AnimatingValues.isAnimating(element)).toBeTruthy();
      
      tick(2);
      
      expect(AnimatingValues.isAnimating(element)).toBeFalsy();
      
    })();
  });
  
  it ('should cancel scheduled cleanup', () => {
    expect(AnimatingValues.isAnimating(element)).toBeFalsy();
    
    fakeAsync(() => {
      AnimatingValues.scheduleCleanup(10, element, (el) => {
        expect(el).toBe(element);
      }, (el) => {
        expect(el).toBe(element);
      });
      
      expect(AnimatingValues.isAnimating(element)).toBeTruthy();
      
      tick(1);
      
      AnimatingValues.cancelAnimation(element);
      
      tick();
      
      expect(AnimatingValues.isAnimating(element)).toBeFalsy();
      
      tick(10);
      
    })();
  });
});

describe('VisibleEffectManager', () => {

  let element:HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
  });
  
  it('should thrown an exception if element is undefined', () => {
    
    expect(() => { 
      fakeAsync(() => { 
        VisibleEffectManager.getState(undefined);
      })(); 
    }).toThrowError('Failed to execute \'getComputedStyle\' on \'Window\': parameter 1 is not of type \'Element\'.');
  });
  
  it('should return SHOWN state', () => {
    var state:VisibleState = VisibleEffectManager.getState(element);
    
    expect(state).toBe(VisibleState.SHOWN);
  });

  it('should add element/VisibleValues into values', () => {
    expect(VisibleEffectManager.values.has(element)).toBeFalsy();
    expect(VisibleEffectManager.populateState(element)).toBe(VisibleState.SHOWN);
    expect(VisibleEffectManager.values.has(element)).toBeTruthy();
  });
  
  it('should return VisibleValues for element', () => {
    expect(VisibleEffectManager.values.has(element)).toBeFalsy();
    expect(VisibleEffectManager.populateState(element)).toBe(VisibleState.SHOWN);
    expect(VisibleEffectManager.getState(element)).toBe(VisibleState.SHOWN);
  });
  
  it('should check is action or state belongs to toogled state.', () => {
    expect(VisibleEffectManager.getToggleState(VisibleAction.SHOW, VisibleState.SHOWN)).toBeTruthy();
    expect(VisibleEffectManager.getToggleState(VisibleAction.HIDE, VisibleState.SHOWN)).toBeFalsy();
    
    expect(VisibleEffectManager.getToggleState(VisibleAction.TOGGLE, VisibleState.HIDING)).toBeTruthy();
    expect(VisibleEffectManager.getToggleState(VisibleAction.TOGGLE, VisibleState.HIDDEN)).toBeTruthy();
    
    expect(VisibleEffectManager.getToggleState(VisibleAction.TOGGLE, VisibleState.SHOWING)).toBeFalsy();
    expect(VisibleEffectManager.getToggleState(VisibleAction.TOGGLE, VisibleState.SHOWN)).toBeFalsy();
    
    expect(() => { 
      fakeAsync(() => { 
        VisibleEffectManager.getToggleState(VisibleAction.TOGGLE, new VisibleState('test'));
      })(); 
    }).toThrowError('Value of [object Object] is not supported');
    
    expect(() => { 
      fakeAsync(() => { 
        VisibleEffectManager.getToggleState(new VisibleAction("rock"), new VisibleState('test'));
      })(); 
    }).toThrowError('Value of [object Object] is not supported');
  });
  
  it('should ', () => {
    fakeAsync(() => {
      let property = 'max-height';
      let timing:CssEffectTiming = CssEffectTiming.LINEAR;
      // cssTimingValue = CssEffectTiming.getCssValue(timing);
      // desiredDuration = 50;
      // propertyValue = '';
      // element = document.createElement('div');
      var effect:VisibleEffect = new CssTransitionEffect(property, new Map<string, string>().set('overflow', 'hidden'));
      let state:VisibleState = VisibleEffectManager.populateState(element);
      VisibleEffectManager.requestShow(element, 1, effect, timing).then((result:VisibleResult) => {
        expect(result).toBe(VisibleResult.NOOP);
      });
    })(); 

  it('should start animation after call the method begin', () => {
    // VisibleEffectManager.begin
  });
});
