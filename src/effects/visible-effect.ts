import {CssEffectTiming} from './css-effect-timing';

export class VisibleEffect {
  
  startShow(element:HTMLElement, desiredDuration:number, timing: CssEffectTiming, fractionComplete:number = 0):number {
    return 0;
  }
  
  startHide(element:HTMLElement, desiredDuration:number, timing: CssEffectTiming, fractionComplete:number = 1):number {
    return 0;
  }

  /**
   * Return the fraction that the animation is complete.
   * - 0 indicates the animation has not started, 
   * - 1 indicates the animation is complete. 
   * - null indicates that it cannot be determined what fraction the animation is complete.
   */
  computeFractionComplete(element:HTMLElement):number {
	  return null;
  };
  
  clearAnimation(element:HTMLElement):void {
    // no op here
  }
  
  static NoOpVisibleEffect:VisibleEffect = new VisibleEffect();
  
  static default(effect?:VisibleEffect):VisibleEffect {
      return effect === undefined || effect === null ? VisibleEffect.NoOpVisibleEffect : effect;
  }
}