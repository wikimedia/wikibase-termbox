declare namespace jest {
	import { Wrapper } from '@vue/test-utils';
	import { Vue } from 'vue/types/vue';

	interface Matchers<R> {
		toHaveSlotWithContent( slot: string, component: Wrapper<Vue> );
	}
}
