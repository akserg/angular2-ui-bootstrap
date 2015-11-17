import {CssTransitionEffect} from './css-transition-effect';
import {Orientation} from '../utils/alignment';

export class ShrinkEffect extends CssTransitionEffect {
  private static horizontalProperty:string = 'max-width';
  private static verticalProperty:string = 'max-height';
  private static animatingOverrides:Map<string, string> = new Map<string, string>().set('overflow', 'hidden');
  
  constructor(private orientation:Orientation) {
    super(ShrinkEffect.isHorizontal(orientation) ? 
      ShrinkEffect.horizontalProperty : ShrinkEffect.verticalProperty, 
      ShrinkEffect.animatingOverrides);
  }
  
  private static isHorizontal(orientation:Orientation):boolean {
    return orientation === Orientation.HORIZONTAL;
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
    if (ShrinkEffect.isHorizontal(this.orientation)) {
      return fractionComplete <= 0 ? '0' : element.scrollWidth * fractionComplete + 'px';
    } else {
      return fractionComplete <= 0 ? '0' : element.scrollHeight * fractionComplete + 'px';
    }
  }

  computeFractionComplete(element:HTMLElement):number {
    if (ShrinkEffect.isHorizontal(this.orientation)) {
      if (element.scrollWidth > 0) {
        return Math.min(1, element.clientWidth / element.scrollWidth);
      }
    } else {
      if (element.scrollHeight > 0) {
        return Math.min(1, element.clientHeight / element.scrollHeight);
      }
    }
  }
}