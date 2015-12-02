import {Injectable} from 'angular2/angular2';
import {global} from 'angular2/src/facade/lang';

import {Dom} from '../utils/dom';

import {VisibleAction} from './visible-action';
import {VisibleResult} from './visible-result';
import {VisibleState} from './visible-state';
import {VisibleValues} from './visible-values';
import {AnimatingValues} from './animating-values';
import {VisibleEffect} from './visible-effect';
import {CssEffectTiming} from './css-effect-timing';

@Injectable()
export class VisibleEffectManager {

	static defaultDuration:number = 250;
	private static defaultDisplays:Map<string, string> = new Map<string, string>();
	static values:WeakMap<HTMLElement, VisibleValues> = new WeakMap<HTMLElement, VisibleValues>();

	/**
	 * Return current state of an element.
	 */
	static getState(element:HTMLElement):VisibleState {
		global.assert(element);
		return VisibleEffectManager.populateState(element);
	}

	/**
	 * Show an element with specified visual effect.
	 */
	static show(element:HTMLElement, effect?: VisibleEffect, duration?:number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {
		return VisibleEffectManager.begin(VisibleAction.SHOW, element, effect, duration, effectTiming);
	}

	/**
	 * Hide an element with specified visual effect.
	 */
	static hide(element:HTMLElement, effect?: VisibleEffect, duration?:number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {
		return VisibleEffectManager.begin(VisibleAction.HIDE, element, effect, duration, effectTiming);
	}

	/**
	 * Toggle the visible state of an element with specified visual effect.
	 */
	static toggle(element:HTMLElement, effect?: VisibleEffect, duration?:number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {
		return VisibleEffectManager.begin(VisibleAction.TOGGLE, element, effect, duration, effectTiming);
	}

	/**
	 * Start any visible action on an element. Developer can use effect, duration and effectTiming to augment an animation effect.
	 */
	static begin(action:VisibleAction, element:HTMLElement, effect?: VisibleEffect, duration?:number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {

		global.assert(action);
		global.assert(element);

		let oldState = VisibleEffectManager.getState(element);
		let doShow = VisibleEffectManager.getToggleState(action, oldState);

		return VisibleEffectManager.requestEffect(doShow, element, duration, effect, effectTiming);
	}

	/**
	 * Populate or create an visual state of an element.
	 * privale
	 */
	static populateState(element:HTMLElement):VisibleState {
		let currentValues:VisibleValues = VisibleEffectManager.values.get(element);

		if (currentValues) {
			return currentValues.currentState;
		}

		let computedStyle:CSSStyleDeclaration = getComputedStyle(element);
		let tagDefaultDisplay = Dom.getDefaultDisplay(element.tagName);

		if (!VisibleEffectManager.defaultDisplays.has(element.tagName)) {
			VisibleEffectManager.defaultDisplays.set(element.tagName, tagDefaultDisplay);
		}

		let localDisplay:string = element.style.display;
		let computedDisplay:string = computedStyle.display;
		let inferredState:VisibleState = computedDisplay === 'none' ? VisibleState.HIDDEN : VisibleState.SHOWN;

		VisibleEffectManager.values.set(element, new VisibleValues(computedDisplay, localDisplay, inferredState));

		return inferredState;
	}

	/**
	 * Chesk is action or state belong to toogle state.
	 * private
	 */
	static getToggleState(action:VisibleAction, state:VisibleState):boolean {
		if (action === VisibleAction.SHOW) {
			return true;
		} if (action === VisibleAction.HIDE) {
			return false;
		} if (action === VisibleAction.TOGGLE) {
			if (state === VisibleState.HIDDEN || state === VisibleState.HIDING) {
				return true;
			} else if (state === VisibleState.SHOWN || state === VisibleState.SHOWING) {
				return false;
			} else {
				throw new Error('Value of ' + state + ' is not supported');
			}
		} else {
			throw new Error('Value of ' + action + ' is not supported');
		}
	}

	/**
	 * Show or hide an element with animation effect.
	 * private
	 */
	static requestEffect(doShow:boolean, element:HTMLElement, desiredDuration:number,
		effect:VisibleEffect, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		// Check the duration
		if (!desiredDuration) {
			desiredDuration = VisibleEffectManager.defaultDuration;
		} else if (desiredDuration < 0) {
			desiredDuration = 0;
		}
		// Check the effect and return the default one if effect is not defined or null
		effect = VisibleEffect.default(effect);
		// Check timing
		if (!effectTiming) {
			effectTiming = CssEffectTiming.defaultTiming;
		}

		if (doShow) {
			return VisibleEffectManager.requestShow(element, desiredDuration, effect, effectTiming);
		} else {
			return VisibleEffectManager.requestHide(element, desiredDuration, effect, effectTiming);
		}
	}

	/**
	 * Show an element with animation effect.
	 * private
	 */
	static requestShow(element:HTMLElement, desiredDuration:number, effect:VisibleEffect, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		global.assert(element);
		global.assert(desiredDuration);
		global.assert(effect);
		global.assert(effectTiming);

		let values:VisibleValues = VisibleEffectManager.values.get(element);

		let fractionComplete:number = null;

		if (values.currentState === VisibleState.SHOWING) {
			// no op - let the current animation finish
			global.assert(AnimatingValues.isAnimating(element));
			return Promise.resolve(VisibleResult.NOOP);
		} else if (values.currentState === VisibleState.SHOWN) {
			// no op. If shown leave it.
			global.assert(!AnimatingValues.isAnimating(element));
			return Promise.resolve(VisibleResult.NOOP);
		} else if (values.currentState === VisibleState.HIDING) {
			fractionComplete = effect.computeFractionComplete(element);
			AnimatingValues.cancelAnimation(element);
		} else if (values.currentState === VisibleState.HIDDEN) {
			// handeled below with a fall-through
		} else {
			throw new Error('the provided value ' + values.currentState + ' is not supported');
		}
		if (fractionComplete === null) {
			fractionComplete = 0;
		}

		global.assert(!AnimatingValues.isAnimating(element));

		VisibleEffectManager.finishShow(element);

		let durationMS:number = effect.startShow(element, desiredDuration, effectTiming, fractionComplete);

		// TODO: we should listen for transitionEnd events rather than manually triggering the cleanup.

		if (durationMS > 0) {
			// finishShow sets the currentState to shown, but we know better since we're animating
			global.assert(values.currentState === VisibleState.SHOWN);
			values.currentState = VisibleState.SHOWING;
			return AnimatingValues.scheduleCleanup(durationMS, element, effect.clearAnimation, VisibleEffectManager.finishShow);
		} else {
			global.assert(values.currentState === VisibleState.SHOWN);
			return Promise.resolve(VisibleResult.IMMEDIATE);
		}
	}

	/**
	 * private
	 */
	static finishShow(element:HTMLElement):void {
		let values:VisibleValues = VisibleEffectManager.values.get(element);
		global.assert(!AnimatingValues.isAnimating(element));
		element.style.display = VisibleEffectManager.getShowDisplayValue(element);
		values.currentState = VisibleState.SHOWN;
	}

	/**
	 * private
	 */
	static requestHide(element:HTMLElement, desiredDuration:number,
		effect:VisibleEffect, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		global.assert(element);
		global.assert(desiredDuration);
		global.assert(effect);
		global.assert(effectTiming);

		let values = VisibleEffectManager.values.get(element);
		if (values) {
			let fractionComplete:number = null;

			if (values.currentState === VisibleState.HIDING) {
				// no op - let the current animation finish
				global.assert(AnimatingValues.isAnimating(element));
				return Promise.resolve(VisibleResult.NOOP);
			} else if (values.currentState === VisibleState.HIDDEN) {
				// it's possible we're here because the inferred calculated value is 'none'
				// this hard-wires the local display value to 'none'...just to be clear
				VisibleEffectManager.finishHide(element);
				return Promise.resolve(VisibleResult.NOOP);
			} else if (values.currentState === VisibleState.SHOWING) {
				fractionComplete = effect.computeFractionComplete(element);
				AnimatingValues.cancelAnimation(element);
			} else if (values.currentState === VisibleState.SHOWN) {
				// handeled below with a fall-through
			} else {
				throw new Error('the provided value ' + values.currentState + ' is not supported');
			}

			if (fractionComplete === null) {
				fractionComplete = 1;
			}

			global.assert(!AnimatingValues.isAnimating(element));

			let durationMS:number = effect.startHide(element, desiredDuration, effectTiming, fractionComplete);

			if (durationMS > 0) {
				VisibleEffectManager.values.get(element).currentState = VisibleState.HIDING;
				return AnimatingValues.scheduleCleanup(durationMS, element, effect.clearAnimation, VisibleEffectManager.finishHide);
			} else {
				VisibleEffectManager.finishHide(element);
				global.assert(values.currentState == VisibleState.HIDDEN);
				return Promise.resolve(VisibleResult.IMMEDIATE);
			}
		} else {
			return Promise.resolve(VisibleResult.IMMEDIATE);
		}
	}

	/**
	 * private
	 */
	static finishHide(element:HTMLElement):void {
		let values:VisibleValues = VisibleEffectManager.values.get(element);

		global.assert(!AnimatingValues.isAnimating(element));

		element.style.display = 'none';

		values.currentState = VisibleState.HIDDEN;
	}

	/**
	 *
	 */
	static getShowDisplayValue(element:HTMLElement):string {
		let values:VisibleValues = VisibleEffectManager.values.get(element);

		if (values.initialComputedDisplay === 'none') {
			// if the element was initially invisible, it's tough to know "why"
			// even if the element has a local display value of 'none' it still
			// might have inherited it from a style sheet
			// so we play say and set the local value to the tag default
			let tagDefault = VisibleEffectManager.defaultDisplays[element.tagName];
			global.assert(tagDefault);
			return tagDefault;
		} else {
			if (values.initialLocalDisplay === '' || values.initialLocalDisplay === 'inherit') {
				// it was originally visible and the local value was empty
				// so returning the local value to '' should ensure it's visible
				return values.initialLocalDisplay;
			} else {
				// it was initially visible, cool
				return values.initialComputedDisplay;
			}
		}
	}
}