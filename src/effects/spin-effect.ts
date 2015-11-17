import {CssTransitionEffect} from './css-transition-effect';

export class SpinEffect extends CssTransitionEffect {
  constructor() { 
    super('-webkit-transform');
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
      return `perspective(600px) rotateX(${(1-fractionComplete) * 90}deg)`;
  }
}
