export class Enum {

  get value():String {
	  return this._value;
  }
  
  constructor(private _value:String){}
}