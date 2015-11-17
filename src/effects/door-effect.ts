import {CssTransitionEffect} from './css-transition-effect';

export class DoorEffect extends CssTransitionEffect {
  constructor() {
    super('-webkit-transform', new Map<string, string>().set('-webkit-transform-origin', '0% 50%'));
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
      return `perspective(600px) rotateX(${(1-fractionComplete) * 90}deg)`;
  }
}