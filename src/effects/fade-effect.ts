import {CssTransitionEffect} from './css-transition-effect';

export class FadeEffect extends CssTransitionEffect {
  private static property:string = 'opacity';
  
  constructor() {
    super(FadeEffect.property);
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
	  return fractionComplete.toString();
  }

  // Infer the fraction complete from the opacity.
  computeFractionComplete(element:HTMLElement):number {
	  return Number.parseFloat(getComputedStyle(element)[FadeEffect.property]);
  }
}