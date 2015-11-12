import {describe, expect} from 'angular2/testing';

import {VisibleEffectManager} from './visible-effect-manager';

describe('VisibleEffectManager', () => {

  let visibleEffectManager:VisibleEffectManager;

  beforeEach(() => {
    visibleEffectManager = new VisibleEffectManager();
  });

  it('should be fine', () => {
  	expect(visibleEffectManager).toBeDefined();
  });
});
