// see: https://vuejs.org/v2/guide/custom-directive.html

import { ObjectDirective } from 'vue';

const focus: ObjectDirective = {
	mounted( el: HTMLElement ): void {
		el.focus();
	},
};
export default focus;
