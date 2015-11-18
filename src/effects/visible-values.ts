import {VisibleState} from './visible-state';

export class VisibleValues {
  	constructor(public initialComputedDisplay:string, public initialLocalDisplay:string, 
	  public currentState:VisibleState) {}
}