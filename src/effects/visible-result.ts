import {Enum} from '../utils/enum';

export class VisibleResult extends Enum {
	static ANIMATED:VisibleResult = new VisibleResult('animated');
	static NOOP:VisibleResult = new VisibleResult('no-op');
	static IMMEDIATE:VisibleResult = new VisibleResult('immediate');
	static CANCELED:VisibleResult = new VisibleResult('canceled');

	get isSuccess():boolean {
		return this !== VisibleResult.CANCELED;
	}
}