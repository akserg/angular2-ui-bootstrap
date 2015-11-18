import {Enum} from '../utils/enum';

export class VisibleAction extends Enum {
	static SHOW:VisibleAction = new VisibleAction('show');
	static HIDE:VisibleAction = new VisibleAction('hide');
	static TOGGLE:VisibleAction = new VisibleAction('toggle');
}