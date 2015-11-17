import {CssTransitionEffect} from './css-transition-effect';

export class ShrinkHeightEffect extends CssTransitionEffect {
  private static property:string = 'max-height';
  private static animatingOverrides:Map<string, string> = new Map<string, string>().set('overflow', 'hidden');
  
  constructor() {
    super(ShrinkHeightEffect.property, ShrinkHeightEffect.animatingOverrides);
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
      return fractionComplete <= 0 ? '0' : element.scrollHeight * fractionComplete + 'px';
  }

  computeFractionComplete(element:HTMLElement):number {
    let scrollHeight:number = element.scrollHeight;
    if (scrollHeight > 0) {
      return Math.min(1, element.clientHeight / element.scrollHeight);
    }
  }
}

export class ShrinkWidthEffect extends CssTransitionEffect {
  private static property:string = 'max-width';
  private static animatingOverrides:Map<string, string> = new Map<string, string>().set('overflow', 'hidden');
  
  constructor() {
    super(ShrinkWidthEffect.property, ShrinkWidthEffect.animatingOverrides);
  }

  computePropertyValue(fractionComplete:number, element:HTMLElement):string {
      return fractionComplete <= 0 ? '0' : element.scrollWidth * fractionComplete + 'px';
  }

  computeFractionComplete(element:HTMLElement):number {
    let scrollWidth:number = element.scrollWidth;
    if (scrollWidth > 0) {
      return Math.min(1, element.clientWidth / element.scrollWidth);
    }
  }
}