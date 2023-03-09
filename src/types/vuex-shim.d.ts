import { InitializedRootState } from '@/store/Root';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$store: Store<InitializedRootState>;
	}
}
