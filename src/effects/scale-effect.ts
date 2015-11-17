import {CssTransitionEffect} from './css-transition-effect';
import {Orientation, HorizontalAlignment, VerticalAlignment} from '../utils/alignment';

export class ScaleEffect extends CssTransitionEffect {

  private static computeValues(xOffset:HorizontalAlignment, yOffset:VerticalAlignment):Map<string, string> {
    if (xOffset === null) {
      xOffset = HorizontalAlignment.CENTER;
    }
    let xoValue:string = xOffset.value;

    if (yOffset === null) {
      yOffset = VerticalAlignment.MIDDLE;
    }
    let yoValue:string = (yOffset === VerticalAlignment.MIDDLE) ? 'center' : yOffset.value;

    return new Map<string, string>().set('-webkit-transform-origin',  `${xoValue} ${yoValue}`);
  }

  constructor(private orientation:Orientation, xOffset:HorizontalAlignment, yOffset:VerticalAlignment) {
    super('-webkit-transform', ScaleEffect.computeValues(xOffset, yOffset));
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
    if (this.orientation === Orientation.VERTICAL) {
      return `scale(1, ${fractionComplete})`;
    } else if (this.orientation === Orientation.HORIZONTAL) {
      return `scale(${fractionComplete}, 1)`;
    } else {
      return `scale(${fractionComplete}, ${fractionComplete})`;
    }
  }

  computeFractionComplete(element:HTMLElement):number {
    return null;
  }
}