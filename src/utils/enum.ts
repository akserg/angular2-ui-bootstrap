export class Enum {

  get value():string {
	  return this._value;
  }
  
  constructor(private _value:string){}
}