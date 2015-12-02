import {Directive, ElementRef} from 'angular2/angular2';
import {HostBinding, HostListener} from 'angular2/core';
import {PromiseCompleter, PromiseWrapper} from 'angular2/src/facade/promise';

import {VisibleComponent} from './visible-component';
import {VisibleEffect} from '../effects/visible-effect';
import {VisibleResult} from '../effects/visible-result';
import {ShrinkEffect} from '../effects/shrink-effect';
import {Orientation} from '../utils/alignment';
import {VisibleAction} from '../effects/visible-action';
import {VisibleEffectManager} from '../effects/visible-effect-manager';

import {Enum} from '../utils/enum';

export class CollapsibleValue extends Enum {
	static COLLAPSED:CollapsibleValue = new CollapsibleValue('collapsed');
	static COLLAPSING:CollapsibleValue = new CollapsibleValue('collapsing');
	static EXPANDED:CollapsibleValue = new CollapsibleValue('expanded');
}

/**
 * CollapsibleComponent is similar to Collapse Plugin
 * (http://getbootstrap.com/javascript/#collapse) in Bootstrap.
 *
 * CollapsibleComponent listens for `click` events and toggles visibility of content
 * if the click target has attribute `data-toggle="collapse"`.
 */
@Directive({
	selector: '[uia-collapse]',
	properties: ['collapse']
})
export class CollapsibleComponent extends VisibleComponent {

	private effect:VisibleEffect = new ShrinkEffect(Orientation.VERTICAL);

	private element:HTMLElement;
	private state:CollapsibleValue = CollapsibleValue.COLLAPSED;

	@HostBinding('class.in') height:string;

// .collapse hides content
// .collapsing is applied during transitions
// .collapse.in shows content

	// @HostBinding('[attr.aria-expanded]') get isExpanded',

	@HostBinding('class.in')
	@HostBinding('attr.aria-expanded')
	get isExpanded():boolean {
		return this.state === CollapsibleValue.EXPANDED;
	}

	@HostBinding('class.collapse')
	get isCollapse():boolean {
		return this.state !== CollapsibleValue.COLLAPSING;
	}

	@HostBinding('class.collapsing')
	get isCollapsing():boolean {
		return this.state === CollapsibleValue.COLLAPSING;
	}

	@HostBinding('attr.aria-hidden')
	get isCollapsed():boolean {
		return this.state === CollapsibleValue.COLLAPSED;
	}

	@HostListener('click', ['$event'])
	onChange(event:any) {
		console.log('event', event);
	}

	constructor(el:ElementRef) {
		super();
		this.element = el.nativeElement;
	}

	expand():Promise<any> {
		if (this.state === CollapsibleValue.COLLAPSED) {
			this.state = CollapsibleValue.COLLAPSING;
			return VisibleEffectManager.show(this.element, this.effect)
			.then((result:VisibleResult) => {
				console.log('expand', result);
				if (result.isSuccess) {
					this.expand();
				}
			});
		} else {
			return Promise.reject('Component expanded yet');
		}
	}

	expand2() {
		if (this.state === CollapsibleValue.COLLAPSED) {
			this.state = CollapsibleValue.COLLAPSING;
			VisibleEffectManager.show(this.element, this.effect)
			.then((result:VisibleResult) => {
				if (result.isSuccess) {
					this.expand();
				}
			});
		}
	}

	private expanded() {
		this.height = 'auto';
		this.state = CollapsibleValue.EXPANDED;
	}

	collapse() {
		if (this.state === CollapsibleValue.EXPANDED) {
			this.state = CollapsibleValue.COLLAPSING;
			VisibleEffectManager.hide(this.element, this.effect)
			.then((result:VisibleResult) => {
				if (result.isSuccess) {
					this.collapsed();
				}
			});
		}
	}

	private collapsed() {
		this.height = '0';
		this.state = CollapsibleValue.COLLAPSED;
	}

	toggle() {
		if (this.state === CollapsibleValue.EXPANDED) {
			this.collapse();
		} else {
			this.expand();
		}
	}
}