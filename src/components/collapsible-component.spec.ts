import {TestComponentBuilder, RootTestComponent, inject, injectAsync, fakeAsync, describe, expect, beforeEach, it, tick, flushMicrotasks} from 'angular2/testing';
import {ElementRef, Component, View} from 'angular2/angular2';

import {CollapsibleComponent} from './collapsible-component';
import {VisibleAction} from '../effects/visible-action';

describe('CollapsibleComponent', () => {

  // let collapsibleComponent:CollapsibleComponent;
  // let element:HTMLElement;

  // beforeEach(() => {
  //   element = document.createElement('div');
  //   let el:ElementRef = {
  //     nativeElement: element,
  //     renderView: null
  //   };
  //   collapsibleComponent = new CollapsibleComponent(el);
  // });
  let tcb: TestComponentBuilder;

  beforeEach(inject([TestComponentBuilder], (_tcb: TestComponentBuilder) => {
    tcb = _tcb;
  }));

  // it('should be fine', () => {
  // 	expect(collapsibleComponent).toBeDefined();
  // });

  // playground(tcb: TestComponentBuilder):Primise<RootTestComponent> {
  //   return null;
    // return tcb.overrideTemplate(TestComponent, '<div><div uia-collapse="isCollapsed"><div class="well well-lg">Some content</div></div></div>')
    //   .createAsync(TestComponent)
    //   .then((rootTC:RootTestComponent) => {
    //     rootTC.detectChanges();
    //     return rootTC;
    //   }));
  // }
  let template:string = '<div><div uia-collapse="isCollapsed"><div class="well well-lg">Some content</div></div></div>';

  function playground(tcb: TestComponentBuilder):Promise<RootTestComponent> {
    return tcb.overrideTemplate(TestComponent, template)
      .createAsync(TestComponent)
      .then((rootTC:RootTestComponent) => {
        rootTC.detectChanges();
        return rootTC;
      });
  }

  // it('should be instantiated and host element must be collapsed', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
  it('should be instantiated and host element must be collapsed', () => {
    fakeAsync(() => {
      playground(tcb).then((rootTC:RootTestComponent) => {
        // Get CollapsibleComponent
        let uiaCollapseInstance:CollapsibleComponent = rootTC.debugElement.componentViewChildren[0].componentInstance;
        // console.log('uiaCollapseInstance', uiaCollapseInstance);
        expect(uiaCollapseInstance).toBeDefined();
        // Get Host Html ELement assosiated with CollapsibleComponent
        let uiaCollapseDOMEl:HTMLElement = rootTC.debugElement.componentViewChildren[0].nativeElement;
        // console.log('uiaCollapseDOMEl', uiaCollapseDOMEl);
        expect(uiaCollapseDOMEl).toBeDefined();
        // Check attributes
        expect(uiaCollapseDOMEl.attributes.getNamedItem('aria-expanded').value).toBe('false');
        expect(uiaCollapseDOMEl.attributes.getNamedItem('aria-hidden').value).toBe('true');
        // // Check classes
        expect(uiaCollapseDOMEl.classList.contains('in')).toBeFalsy();
        expect(uiaCollapseDOMEl.classList.contains('collapse')).toBeTruthy();
        // // Chech height
        expect(uiaCollapseDOMEl.style.height).toBe('');
      });
      tick();
    })();
  });

  it('should be available to be collapsed programmatically', injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
      return playground(tcb).then((rootTC:RootTestComponent) => {
        // Get CollapsibleComponent
        let uiaCollapseInstance:CollapsibleComponent = rootTC.debugElement.componentViewChildren[0].componentInstance;
        // Get Host Html ELement assosiated with CollapsibleComponent
        let uiaCollapseDOMEl:HTMLElement = rootTC.debugElement.componentViewChildren[0].nativeElement;

        console.log('---------------------------');
        console.log('uiaCollapseInstance', uiaCollapseInstance);
        console.log('uiaCollapseDOMEl', uiaCollapseDOMEl);
        console.log('uiaCollapseDOMEl.style.height', uiaCollapseDOMEl.style.height);

        fakeAsync(() => {
          uiaCollapseInstance.expand().then(() => {
            rootTC.detectChanges();
            console.log('---------------------------');
            console.log('uiaCollapseInstance', uiaCollapseInstance);
            console.log('uiaCollapseDOMEl', uiaCollapseDOMEl);
            console.log('uiaCollapseDOMEl.style.height', uiaCollapseDOMEl.style.height);
          });
          tick(1000);
        })();

        // // Check attributes
        // expect(uiaCollapseDOMEl.attributes.getNamedItem('aria-expanded').value).toBe('false');
        // expect(uiaCollapseDOMEl.attributes.getNamedItem('aria-hidden').value).toBe('false');
        // // // Check classes
        // expect(uiaCollapseDOMEl.classList.contains('collapsing')).toBeTruthy();
        // // // Chech height
        // expect(uiaCollapseDOMEl.style.height).toBe('');

        // setTimeout(() => {
        //   console.log('---------------------------');
        //   console.log('uiaCollapseInstance', uiaCollapseInstance);
        //   console.log('uiaCollapseDOMEl', uiaCollapseDOMEl);
        //   console.log('uiaCollapseDOMEl.style.height', uiaCollapseDOMEl.style.height);
        // }, 1000);
        // Run another part of animation
        // tick(1260);
        // rootTC.detectChanges();

        // console.log('---------------------------');
        // console.log('uiaCollapseInstance', uiaCollapseInstance);
        // console.log('uiaCollapseDOMEl', uiaCollapseDOMEl);
        // console.log('uiaCollapseDOMEl.style.height', uiaCollapseDOMEl.style.height);

        // Check attributes
        // expect(uiaCollapseDOMEl.attributes.getNamedItem('aria-expanded').value).toBe('false');
        // expect(uiaCollapseDOMEl.attributes.getNamedItem('aria-hidden').value).toBe('false');
        // // // Check classes
        // expect(uiaCollapseDOMEl.classList.contains('collapsing')).toBeTruthy();
        // // Chech height
        // expect(uiaCollapseDOMEl.style.height).toBe('');
      });

  }));
});

@Component({selector: 'test-cmp'})
@View({directives: [CollapsibleComponent]})
class TestComponent {}


/*
import { TestComponentBuilder, describe, expect, injectAsync, it } from 'angular2/testing';
import {Component, View} from 'angular2/angular2';
import {DOM} from 'angular2/src/core/dom/dom_adapter';
import {AboutCmp} from './about';
import {NameList} from '../../services/name_list';

export function main() {
  describe('About component', () => {
    it('should work',
      injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.overrideTemplate(TestComponent, '<div><about></about></div>')
          .createAsync(TestComponent)
          .then((rootTC) => {
            rootTC.detectChanges();

            let aboutInstance = rootTC.debugElement.componentViewChildren[0].componentInstance;
            let aboutDOMEl = rootTC.debugElement.componentViewChildren[0].nativeElement;
            let nameListLen = function () {
              return aboutInstance.list.names.length;
            };

            expect(aboutInstance.list).toEqual(jasmine.any(NameList));
            expect(nameListLen()).toEqual(4);
            expect(DOM.querySelectorAll(aboutDOMEl, 'li').length).toEqual(nameListLen());

            aboutInstance.addName({value: 'Minko'});
            rootTC.detectChanges();

            expect(nameListLen()).toEqual(5);
            expect(DOM.querySelectorAll(aboutDOMEl, 'li').length).toEqual(nameListLen());

            expect(DOM.querySelectorAll(aboutDOMEl, 'li')[4].textContent).toEqual('Minko');
          });
      }));
  });
}

@Component({providers: [NameList], selector: 'test-cmp'})
@View({directives: [AboutCmp]})
class TestComponent {}
*/