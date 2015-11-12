import {Injectable} from 'angular2/angular2';

import {global} from 'angular2/src/core/facade/lang';
import {TimerWrapper} from 'angular2/src/core/facade/async';

import {VisibleEffect} from './visible-effect';
import {CssEffectTiming} from './css-effect-timing';
import {iteratorToArray} from '../utils/to-array';

@Injectable()
export class CssTransitionEffect extends VisibleEffect {

	private static reservedProperties:Array<string> = ['transitionProperty', 'transitionDuration'];

	constructor(private property:string, private animatingOverrides:Map<string, string> = new Map<string, string>()) {
		super();
	}

	startShow(element:HTMLElement, desiredDuration:number, timing: CssEffectTiming, fractionComplete:number = 0):number {
		return this.startAnimation(true, element, desiredDuration, timing, fractionComplete);
	}

	startHide(element:HTMLElement, desiredDuration:number, timing: CssEffectTiming, fractionComplete:number = 1):number {
		return this.startAnimation(false, element, desiredDuration, timing, fractionComplete);
	}

	private startAnimation(doingShow:boolean, element:HTMLElement, desiredDuration:number,
		timing:CssEffectTiming, fractionComplete:number):number {

		global.assert(desiredDuration > 0);
		global.assert(timing != null);

		let localPropsToKeep:Array<string> = [this.property];
		localPropsToKeep.concat(iteratorToArray(<Iterator<any>>this.animatingOverrides.keys()));

		let localValues = CssTransitionEffect.recordProperties(element, localPropsToKeep);

		this.animatingOverrides.forEach((value: string, key: string) => {
			element.style.setProperty(key, value);
		}, this);

		let startValue:string = this.computePropertyValue(fractionComplete, element);
		let endValue:string = this.computePropertyValue(doingShow ? 1 : 0, element);

		let animationFractionLeft:number = doingShow ? (1 - fractionComplete) : fractionComplete;
		let actualDuration:number = Math.round(desiredDuration * animationFractionLeft);
		element.style.setProperty(this.property, startValue);

		Css3TransitionEffectValues.delayStart(element, localValues, () => {
			this.setShowValue(element, endValue, actualDuration, timing)
		});

		return actualDuration;
	}

	clearAnimation(element:HTMLElement):void {
		let restoreValues:Map<string, string> = Css3TransitionEffectValues.cleanup(element);

		element.style.transitionTimingFunction = '';
		element.style.transitionProperty = '';
		element.style.transitionDuration = '';

		restoreValues.forEach((value:string, key:string) => {
			element.style.setProperty(key, value);
		});
	}

	private setShowValue(element:HTMLElement, value:string, desiredDuration:number, timing:CssEffectTiming):void {

		let cssTimingValue = CssEffectTiming.getCssValue(timing);

		element.style.transitionTimingFunction = cssTimingValue;
		element.style.transitionProperty = this.property;
		element.style.transitionDuration = desiredDuration + 'ms';
		element.style.setProperty(this.property, value);
	}

	/**
	* Compute the value of the CSS property value given the current fraction
	* the effect is complete.
	*/
	computePropertyValue(fractionComplete:number, element:HTMLElement):string {
		return '';
	}

	private static recordProperties(element:HTMLElement, properties:Array<string>):Map<string, string> {
		let map:Map<string, string> = new Map<string, string>();

		for (let p in properties) {
			global.assert(!map.has(p));
			map[p] = element.style.getPropertyValue(p);
		}

		return map;
	}
}

export class Css3TransitionEffectValues {
	private static values:WeakMap<HTMLElement, Css3TransitionEffectValues> = new WeakMap<HTMLElement, Css3TransitionEffectValues>();

	private timer:any;

	constructor(private element:HTMLElement, private originalValues:Map<string, string>) {}

	static delayStart(element:HTMLElement, originalValues:Map<string, string>, action: Function):void {
		global.assert(Css3TransitionEffectValues.values[<any>element] === null);

		let value = Css3TransitionEffectValues.values[<any>element] = new Css3TransitionEffectValues(element, originalValues);

		value.timer = TimerWrapper.setTimeout(() => {
			global.assert(value.timer != null);
			value.timer = null;
			action();
		}, 1);
	}

	static cleanup(element:HTMLElement):Map<string, string> {
		let value = Css3TransitionEffectValues.values[<any>element];
		global.assert(value != null);
		Css3TransitionEffectValues.values[<any>element] = null;
		return value._cleanup();
	}

	private _cleanup():Map<string, string> {
		if (this.timer != null) {
			TimerWrapper.clearTimeout(this.timer);
			this.timer = null;
		}

		return this.originalValues;
	}
}
