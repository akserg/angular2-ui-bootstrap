import {describe, expect, beforeEach, it} from 'angular2/testing';

import {CollapsibleComponent} from './collapsible-component';

describe('CollapsibleComponent', () => {

  let collapsibleComponent:CollapsibleComponent;

  beforeEach(() => {
    collapsibleComponent = new CollapsibleComponent();
  });

  it('should be fine', () => {
  	expect(collapsibleComponent).toBeDefined();
  });
});