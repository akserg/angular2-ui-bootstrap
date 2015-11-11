import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {VisibleComponent} from './visible-component';

import {Component} from 'angular2/angular2';

describe('VisibleComponent', () => {

  let visibleComponent:VisibleComponent;

  beforeEach(() => {
    visibleComponent = new VisibleComponent();
  });

  it('should be fine', () => {
  	expect(visibleComponent).toBeDefined();
  });

});
