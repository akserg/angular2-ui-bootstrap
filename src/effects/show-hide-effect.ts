export class ShowHideAction {
  public static SHOW = 'show';
  public static HIDE = 'hide';
  public static TOGGLE = 'toggle';
}

export class ShowHideResult {
  public static ANIMATED = 'animated';
  public static NOOP = 'no-op';
  public static IMMEDIATE = 'immediate';
  public static CANCELED = 'canceled';
}

export class ShowHide {
  static _defaultDuration:Number = 218;
  static _defaultDisplays:{[key: String]: String} = {};
  static _values:any = {};
}
