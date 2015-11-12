import {Injectable} from 'angular2/angular2';
import {global} from 'angular2/src/core/facade/lang';
import {PromiseCompleter} from 'angular2/src/core/facade/promise';
import {TimerWrapper} from 'angular2/src/core/facade/async';

import {Enum} from '../utils/enum';

import {VisibleEffect} from './visible-effect';
import {CssEffectTiming} from './css-effect-timing';

export class VisibleAction extends Enum {
	static SHOW:VisibleAction = new VisibleAction('show');
	static HIDE:VisibleAction = new VisibleAction('hide');
	static TOGGLE:VisibleAction = new VisibleAction('toggle');
}

export class VisibleResult extends Enum {
	static ANIMATED:VisibleResult = new VisibleResult('animated');
	static NOOP:VisibleResult = new VisibleResult('no-op');
	static IMMEDIATE:VisibleResult = new VisibleResult('immediate');
	static CANCELED:VisibleResult = new VisibleResult('canceled');

	get isSuccess():boolean {
		return this !== VisibleResult.CANCELED;
	}
}

export class VisibleState extends Enum {
	static SHOWN:VisibleState = new VisibleState('shown');
	static HIDDEN:VisibleState = new VisibleState('hidden');
	static SHOWING:VisibleState = new VisibleState('showing');
	static HIDING:VisibleState = new VisibleState('hidding');

	static byName(name:string):VisibleState {
		//return $([SHOWN, HIDDEN, SHOWING, HIDING]).singleWhere((shs) => shs.cssName == name);
		return null;
	}

	get isFinished():boolean {
		return this === VisibleState.HIDDEN || this === VisibleState.SHOWN;
	}

	get isShow():boolean {
		return this === VisibleState.SHOWN || this === VisibleState.SHOWING;
	};
}

class VisibleValues {
  	constructor(public initialComputedDisplay:string, public initialLocalDisplay:string, public currentState:VisibleState) {}
}

@Injectable()
export class VisibleEffectManager {

	private static _defaultDuration:number = 218;
	private static _defaultDisplays:Map<string, string> = new Map<string, string>();
	static _values:WeakMap<HTMLElement, VisibleValues> = new WeakMap<HTMLElement, VisibleValues>();

	static getState(element:HTMLElement):VisibleState {
		assert(element !== null);
		return VisibleEffectManager._populateState(element);
	}

	static show(element:HTMLElement, effect?: VisibleEffect, duration?:Number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {
		return VisibleEffectManager.begin(VisibleAction.SHOW, element, effect, duration, effectTiming);
	}

	static hide(element:HTMLElement, effect?: VisibleEffect, duration?:Number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {
		return VisibleEffectManager.begin(VisibleAction.HIDE, element, effect, duration, effectTiming);
	}

	static toggle(element:HTMLElement, effect?: VisibleEffect, duration?:Number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {
		return VisibleEffectManager.begin(VisibleAction.TOGGLE, element, effect, duration, effectTiming);
	}

	static begin(action:VisibleAction, element:HTMLElement, effect?: VisibleEffect, duration?:Number, effectTiming?:CssEffectTiming):Promise<VisibleResult> {

		global.assert(action != null);
		global.assert(element != null);

		// let oldState = getState(element);
		// let doShow = _getToggleState(action, oldState);

		// return _requestEffect(doShow, element, duration, effect, effectTiming);
		return null
	}

	static _populateState(element:HTMLElement):VisibleState {
		let currentValues:VisibleValues = VisibleEffectManager._values[<any>element];

		if (currentValues) {
			return currentValues.currentState;
		}

		let computedStyle = (<any>element).getComputedStyle('');
		let tagDefaultDisplay = ''; // TODO: Tools.getDefaultDisplay(element.tagName);

		if (!VisibleEffectManager._defaultDisplays.has(element.tagName)) {
			VisibleEffectManager._defaultDisplays.set(element.tagName, tagDefaultDisplay);
		}

		let localDisplay:string = element.style.display;
		let computedDisplay:string = computedStyle.display;
		let inferredState:VisibleState = computedDisplay === 'none' ? VisibleState.HIDDEN : VisibleState.SHOWN;

		VisibleEffectManager._values[<any>element] = new VisibleValues(computedDisplay, localDisplay, inferredState);

		return inferredState;
	}

	static _getToggleState(action:VisibleAction, state:VisibleState):boolean {
		if (action === VisibleAction.SHOW) {
			return true;
		} if (action === VisibleAction.HIDE) {
			return false;
		} if (action === VisibleAction.TOGGLE) {
			if (state === VisibleState.HIDDEN || state === VisibleState.HIDING) {
				return true;
			} else if (state === VisibleState.HIDDEN || state === VisibleState.HIDING) {
				return false;
			} else {
				throw new Error('Value of ' + state + ' is not supported');
			}
		} else {
			throw new Error('Value of ' + action + ' is not supported');
		}
	}

	static _requestEffect(doShow:boolean, element:HTMLElement, desiredDuration:number,
		effect:VisibleEffect, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		//
		// clean up possible null or invalid values
		//
		if (desiredDuration === null) {
			desiredDuration = VisibleEffectManager._defaultDuration;
		} else if (desiredDuration < 0) {
			desiredDuration = 0;
		}

		effect = VisibleEffect.default(effect);

		if (effectTiming === null) {
			effectTiming = CssEffectTiming.defaultTiming;
		}

		//
		// do the transform
		//
		if (doShow) {
			return VisibleEffectManager._requestShow(element, desiredDuration, effect, effectTiming);
		} else {
			return VisibleEffectManager._requestHide(element, desiredDuration, effect, effectTiming);
		}
	}

	static _requestShow(element:HTMLElement, desiredDuration:number,
		effect:VisibleEffect, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		global.assert(element != null);
		global.assert(desiredDuration != null);
		global.assert(effect != null);
		global.assert(effectTiming != null);

		let values:VisibleValues = VisibleEffectManager._values[<any>element];

		let fractionComplete:number = null;

		if (values.currentState === VisibleState.SHOWING) {
			// no op - let the current animation finish
			global.assert(_AnimatingValues.isAnimating(element));
			return Promise.resolve(VisibleResult.NOOP); // new Future.value(VisibleResult.NOOP);
		} else if (values.currentState === VisibleState.SHOWN) {
			// no op. If shown leave it.
			global.assert(!_AnimatingValues.isAnimating(element));
			return Promise.resolve(VisibleResult.NOOP); // new Future.value(VisibleResult.NOOP);
		} else if (values.currentState === VisibleState.HIDING) {
			fractionComplete = effect.computeFractionComplete(element);
			_AnimatingValues.cancelAnimation(element);
		} else if (values.currentState === VisibleState.HIDDEN) {
			// handeled below with a fall-through
		} else {
			throw new Error('the provided value ' + values.currentState + ' is not supported');
		}
		if (fractionComplete == null) {
			fractionComplete = 0;
		}

		global.assert(!_AnimatingValues.isAnimating(element));

		VisibleEffectManager._finishShow(element);

		let durationMS:number = effect.startShow(element, desiredDuration, effectTiming, fractionComplete);

		// TODO(jacobr): we should listen for transitionEnd events rather than
		// manually triggering the cleanup.

		if (durationMS > 0) {
			// _finishShow sets the currentState to shown, but we know better since we're animating
			global.assert(values.currentState === VisibleState.SHOWN);
			values.currentState = VisibleState.SHOWING;
			return _AnimatingValues.scheduleCleanup(durationMS, element, effect.clearAnimation, VisibleEffectManager._finishShow);
		} else {
			global.assert(values.currentState === VisibleState.SHOWN);
			return Promise.resolve(VisibleResult.IMMEDIATE); // new Future.value(VisibleResult.IMMEDIATE);
		}
	}

	static _finishShow(element:HTMLElement):void {
		let values:VisibleValues = VisibleEffectManager._values[<any>element];
		global.assert(!_AnimatingValues.isAnimating(element));
		element.style.display = VisibleEffectManager._getShowDisplayValue(element);
		values.currentState = VisibleState.SHOWN;
	}

	static _requestHide(element:HTMLElement, desiredDuration:number,
		effect:VisibleEffect, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		global.assert(element != null);
		global.assert(desiredDuration != null);
		global.assert(effect != null);
		global.assert(effectTiming != null);

		let values = VisibleEffectManager._values[<any>element];
		let fractionComplete:number = null;

		if (values.currentState === VisibleState.HIDING) {
			// no op - let the current animation finish
			global.assert(_AnimatingValues.isAnimating(element));
			return Promise.resolve(VisibleResult.NOOP); // new Future.value(ShowHideResult.NOOP);
		} else if (values.currentState === VisibleState.HIDDEN) {
			// it's possible we're here because the inferred calculated value is 'none'
			// this hard-wires the local display value to 'none'...just to be clear
			VisibleEffectManager._finishHide(element);
			return Promise.resolve(VisibleResult.NOOP); // new Future.value(ShowHideResult.NOOP);
		} else if (values.currentState === VisibleState.SHOWING) {
			fractionComplete = effect.computeFractionComplete(element);
			_AnimatingValues.cancelAnimation(element);
		} else if (values.currentState === VisibleState.SHOWN) {
			// handeled below with a fall-through
		} else {
			throw new Error('the provided value ' + values.currentState + ' is not supported');
		}

		if (fractionComplete === null) {
			fractionComplete = 1;
		}

		global.assert(!_AnimatingValues.isAnimating(element));

		let durationMS:number = effect.startHide(element, desiredDuration, effectTiming, fractionComplete);

		if (durationMS > 0) {
			VisibleEffectManager._values[<any>element].currentState = VisibleState.HIDING;
			return _AnimatingValues.scheduleCleanup(durationMS, element, effect.clearAnimation, VisibleEffectManager._finishHide);
		} else {
			VisibleEffectManager._finishHide(element);
			global.assert(values.currentState == VisibleState.HIDDEN);
			return Promise.resolve(VisibleResult.IMMEDIATE); // new Future.value(ShowHideResult.IMMEDIATE);
		}
	}

	static _finishHide(element:HTMLElement):void {
		let values:VisibleValues = VisibleEffectManager._values[<any>element];

		global.assert(!_AnimatingValues.isAnimating(element));

		element.style.display = 'none';

		values.currentState = VisibleState.HIDDEN;
	}

	static _getShowDisplayValue(element:HTMLElement):string {
		let values:VisibleValues = VisibleEffectManager._values[<any>element];

		if (values.initialComputedDisplay === 'none') {
			// if the element was initially invisible, it's tough to know "why"
			// even if the element has a local display value of 'none' it still
			// might have inherited it from a style sheet
			// so we play say and set the local value to the tag default
			let tagDefault = VisibleEffectManager._defaultDisplays[element.tagName];
			global.assert(tagDefault != null);
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


export class _AnimatingValues {
  private static _aniValues:WeakMap<HTMLElement, _AnimatingValues> = new WeakMap<HTMLElement, _AnimatingValues>();

  private _completer:PromiseCompleter<VisibleResult> = new PromiseCompleter<VisibleResult>();

  private _timer:any;

  constructor(private _element:HTMLElement, private _cleanupAction:Function, private _finishFunc:Function) {
    global.assert(_AnimatingValues._aniValues[<any>this._element] === null);
    _AnimatingValues._aniValues[<any>this._element] = this;
  }

  private _start(durationMS:number):Promise<VisibleResult> {
    global.assert(durationMS > 0);
    global.assert(this._timer === null);

    this._timer = TimerWrapper.setTimeout(this._complete, durationMS);
    return this._completer.promise;
  }

  private _cancel():void {
    global.assert(this._timer !== null);
    this._timer.cancel();
    this._cleanup();
    this._completer.resolve(VisibleResult.CANCELED);
  }

  private _complete():void {
    this._cleanup();
    this._finishFunc(this._element);
    this._completer.resolve(VisibleResult.ANIMATED);
  }

  private _cleanup():void {
    global.assert(_AnimatingValues._aniValues[<any>this._element] !== null);
    this._cleanupAction(this._element);
    _AnimatingValues._aniValues[<any>this._element] = null;
  }

  static isAnimating(element:HTMLElement):boolean {
    let values:VisibleValues = _AnimatingValues._aniValues[<any>element];
    return values != null;
  }

  static cancelAnimation(element:HTMLElement):void {
    let values:_AnimatingValues = _AnimatingValues._aniValues[<any>element];
    global.assert(values !== null);
    values._cancel();
  }

  static scheduleCleanup(durationMS:number, element:HTMLElement,
                              cleanupAction:Function,
                              finishAction:Function):Promise<VisibleResult> {

    let value:_AnimatingValues = new _AnimatingValues(element, cleanupAction, finishAction);
    return value._start(durationMS);
  }
}
