// see: https://vuejs.org/v2/guide/custom-directive.html

import { DirectiveOptions } from 'vue';

const focus: DirectiveOptions = {
	inserted( el: HTMLElement ): void {
		el.focus();
	},
};
export default focus;
