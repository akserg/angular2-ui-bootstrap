import {describe, beforeEach, expect, it, fakeAsync, tick, flushMicrotasks} from 'angular2/testing';

import {VisibleEffectManager} from './visible-effect-manager';
import {VisibleAction} from './visible-action';
import {VisibleResult} from './visible-result';
import {VisibleState} from './visible-state';
import {AnimatingValues} from './animating-values';
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
  let property:string;
  var effect:VisibleEffect;

  beforeEach(() => {
    element = document.createElement('div');
    property = 'max-height';
    effect = new CssTransitionEffect(property, new Map<string, string>().set('overflow', 'hidden'));
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
  
  it('should start animation after call the method hide', () => {
    fakeAsync(() => {
      VisibleEffectManager.hide(element, effect).then((result:VisibleResult) => {
        expect(element.style.display).toBe('none');
        expect(result).toBeDefined(VisibleResult.ANIMATED);
      });
      tick(VisibleEffectManager.defaultDuration);
    })(); 
  });
  
  it('should start animation after call the method show', () => {
    fakeAsync(() => {
      VisibleEffectManager.show(element, effect).then((result:VisibleResult) => {
        expect(element.style.display).toBe('');
        expect(result).toBeDefined(VisibleResult.ANIMATED);
      });
      tick(VisibleEffectManager.defaultDuration);
    })(); 
  });
  
  it('should start animation after call the method toggle', () => {
    fakeAsync(() => {
      VisibleEffectManager.hide(element, effect).then((result:VisibleResult) => {
        expect(element.style.display).toBe('none');
        expect(result).toBeDefined(VisibleResult.ANIMATED);
        VisibleEffectManager.toggle(element, effect).then((result:VisibleResult) => {
          expect(element.style.display).toBe('');
          expect(result).toBeDefined(VisibleResult.ANIMATED);
        });
        tick(VisibleEffectManager.defaultDuration);
      });
      tick(VisibleEffectManager.defaultDuration);
    })(); 
  });
});
