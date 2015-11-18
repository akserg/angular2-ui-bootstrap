import {Enum} from '../utils/enum';

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