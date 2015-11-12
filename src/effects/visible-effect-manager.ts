import {Enum} from '../utils/enum';
import {Injectable} from 'angular2/angular2';
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

@Injectable()
export class VisibleEffectManager {

	begin(action:VisibleAction, element:HTMLElement, effect: VisibleEffect, duration:Number, effectTiming:CssEffectTiming):Promise<VisibleResult> {

		// final oldState = getState(element);
		// final doShow = _getToggleState(action, oldState);

		// return _requestEffect(doShow, element, duration, effect, effectTiming);
		return null;
	}

}