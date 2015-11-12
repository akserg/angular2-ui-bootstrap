import {describe, beforeEach, expect, it, fakeAsync, tick} from 'angular2/testing';
import {PromiseWrapper} from 'angular2/src/core/facade/async';

import {VisibleEffectManager} from './visible-effect-manager';

describe('VisibleEffectManager', () => {

  let visibleEffectManager:VisibleEffectManager;

  beforeEach(() => {
    visibleEffectManager = new VisibleEffectManager();
  });

  it('should be defined', () => {
  	expect(visibleEffectManager).toBeDefined();
  });

  it('should start animation after call begin method', () => {
    // VisibleEffectManager.begin
  });
});
