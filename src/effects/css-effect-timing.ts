import {Injectable} from 'angular2/angular2';

@Injectable()
export class CssEffectTiming {
  constructor(private cssName:string) {}

  static getCssValue(timing:CssEffectTiming):string {
	  return timing ? timing.cssName : '';
  }

  static LINEAR:CssEffectTiming = new CssEffectTiming('linear');
  static EASE:CssEffectTiming = new CssEffectTiming('ease');
  static EASE_IN:CssEffectTiming = new CssEffectTiming('ease-in');
  static EASE_IN_OUT:CssEffectTiming = new CssEffectTiming('ease-in-out');
  static EASE_OUT:CssEffectTiming = new CssEffectTiming('ease-out');
}