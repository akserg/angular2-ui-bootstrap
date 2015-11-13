import {global} from 'angular2/src/core/facade/lang';

export class Dom {
	private static _elemDisplay:Map<string, string> = new Map<string, string>();

	private static css_defaultDisplay(nodeName:string):string {
		// skipping crazy iframe dance for now...
		return Dom.actualDisplay(nodeName, document);
	}

	private static defaultDisplayHard(nodeName:string):string {
		throw 'Not sure how to calculate display of: ' + nodeName;

		// TODO: can't make any progress here
		// IFrameElement.contentWindow is a WindowBase
		// which doesn't let me get to the doc.

		/*
		if(_iframe == null) {
		_iframe = new Element.tag('iframe')
		..attributes['frameborder'] = '0'
		..attributes['width'] = '0'
		..attributes['height'] = '0'
		..attributes['style'] = 'display: block !important';
		}

		document.body.children.add(_iframe);

		final frameDoc = _iframe.contentWindow;
		*/
	}

	private static actualDisplay(name:string, doc:HTMLDocument):string {
		let elem:HTMLElement = doc.createElement(name); //new Element.tag(name);
		doc.body.appendChild(elem);

		let css:CSSStyleDeclaration = getComputedStyle(elem);
		let value:string = css.display;
		elem.remove();

		return value;
	}

	// Try to determine the default display value of an element
	static getDefaultDisplay(nodeName:string):string {
		let storedValue:string = Dom._elemDisplay[nodeName];
		if (storedValue) {
			return storedValue;
		} else {
			let defaultDisplay:string = Dom.css_defaultDisplay(nodeName);

			global.assert(defaultDisplay !== null);

			if (defaultDisplay === 'none' || defaultDisplay === '') {
				return Dom.defaultDisplayHard(nodeName);
			} else {
				return defaultDisplay;
			}
		}
	}

}