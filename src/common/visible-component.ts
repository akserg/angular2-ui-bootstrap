/**
 * Visible Component has two states visible and invisible.
 */
export class VisibleComponent {
	isShown: boolean = false;

	show() {
		this.isShown = true;
	}

	hide() {
		this.isShown = false;
	}

	toggle() {
		this.isShown != this.isShown;
	}
}