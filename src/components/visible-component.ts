import {Injectable, EventEmitter, Output} from 'angular2/angular2';

export class VisibleEvent {
	static SHOWN:VisibleEvent = new VisibleEvent('shown');
	static HIDDEN:VisibleEvent = new VisibleEvent('hidden');
	
	constructor(public type:String) {}
}

/**
 * Visible Component has two states SHOWN and HIDDEN.
 */
@Injectable()
export class VisibleComponent {
	@Output('visibleEvent') visibleEvent:EventEmitter = new EventEmitter();
	
	private _isShown: boolean;
	
	constructor() {
		this._isShown = false;
	}
	
	get isShown():boolean {
		return this._isShown;
	}
	
	set isShown(value:boolean) {
		value = !!value;
		if (value !== this._isShown) {
			this._isShown = value;
			this.visibleEvent.next(this._isShown ? VisibleEvent.SHOWN : VisibleEvent.HIDDEN);
		}
	}

	show() {
		this.isShown = true;
	}

	hide() {
		this.isShown = false;
	}

	toggle() {
		this.isShown = !this.isShown;
	}
}