import App from '@/components/App.vue';
import { createStore } from '@/store';
import initStore from '@/common/initStore';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import Vue, {
	ComponentOptions,
	CreateElement,
	VueConstructor,
} from 'vue';

export interface MwVueConstructor {
	createMwApp( componentOptions: ComponentOptions<Vue> ): Vue3LikeApp;
}

export interface Vue3LikeApp {
	mount( selector: string ): unknown;
}

export function buildAppMw( termboxRequest: TermboxRequest, services: TermboxServices ): Promise<Vue3LikeApp> {
	const store = createStore( services );
	const compatApp = {
		store,
		render( h: CreateElement ) {
			return h( App );
		},
	};
	const app = ( Vue as VueConstructor & MwVueConstructor ).createMwApp( compatApp );
	return initStore( store, termboxRequest ).then( () => app );
}

export function buildAppSsr( termboxRequest: TermboxRequest, services: TermboxServices ): Promise<Vue> {
	const store = createStore( services );
	const app = new App( {
		store,
	} );
	return initStore( store, termboxRequest ).then( () => app );
}
