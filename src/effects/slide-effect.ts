import {CssTransitionEffect} from './css-transition-effect';
import {Orientation, HorizontalAlignment, VerticalAlignment} from '../utils/alignment';

export class SlideEffect extends CssTransitionEffect {
  

  constructor(private xStart:HorizontalAlignment, private yStart:VerticalAlignment) {
    super('-webkit-transform');
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
    if (fractionComplete >= 1) {
      return 'translate3d(0,0,0)';
    }
    var offset = `${(1 - fractionComplete) * 100}`;
    let xComponent:string;
    switch(this.xStart) {
      case HorizontalAlignment.LEFT:
        xComponent = `-${offset}%`;
        break;
      case HorizontalAlignment.RIGHT:
        xComponent = `${offset}%`;
        break;
      case HorizontalAlignment.CENTER:
      default:
        xComponent = '0';
        break;
    }

    let yComponent:string;
    switch(this.yStart) {
      case VerticalAlignment.TOP:
        yComponent = `-${offset}%`;
        break;
      case VerticalAlignment.BOTTOM:
        yComponent = `${offset}%`;
        break;
      case VerticalAlignment.MIDDLE:
      default:
        yComponent = '0';
        break;
    }
    return `translate3d(${xComponent}, ${yComponent}, 0)`;
  }
}
