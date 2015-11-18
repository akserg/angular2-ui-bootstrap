import {describe, expect, beforeEach, it} from 'angular2/testing';

import {CollapsibleComponent} from './collapsible-component';
import {VisibleAction} from '../effects/visible-action';

describe('CollapsibleComponent', () => {

  let collapsibleComponent:CollapsibleComponent;

  beforeEach(() => {
    collapsibleComponent = new CollapsibleComponent(null);
  });

  it('should be fine', () => {
  	expect(collapsibleComponent).toBeDefined();
  });
});