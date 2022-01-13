import focus from '@/directives/focus';
import inlanguage from '@/directives/inlanguage';
import App from '@/components/App.vue';
import newConfigMixin, { ConfigOptions } from '@/components/mixins/newConfigMixin';
import { createStore } from '@/store';
import initStore from '@/common/initStore';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import Vue, {
	ComponentOptions,
	CreateElement,
	VueConstructor,
} from 'vue';

export interface Vue3LikeApp {
	mount( selector: string ): unknown;
}

export interface MwVueConstructor {
	createMwApp( componentOptions: ComponentOptions<Vue> ): Vue3LikeApp;
}

export function buildAppMw(
	termboxRequest: TermboxRequest,
	services: TermboxServices,
	config: ConfigOptions,
): Promise<Vue3LikeApp> {
	Vue.mixin( newConfigMixin( config ) );
	Vue.directive( 'inlanguage', inlanguage );
	Vue.directive( 'focus', focus );
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

export function buildAppSsr(
	termboxRequest: TermboxRequest,
	services: TermboxServices,
	config: ConfigOptions,
): Promise<Vue> {
	Vue.mixin( newConfigMixin( config ) );
	Vue.directive( 'inlanguage', inlanguage );
	Vue.directive( 'focus', focus );
	const store = createStore( services );
	const app = new App( {
		store,
	} );
	return initStore( store, termboxRequest ).then( () => app );
}
