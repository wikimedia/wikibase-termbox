import focus from '@/directives/focus';
import inlanguage from '@/directives/inlanguage';
import App from '@/components/App.vue';
import newConfigMixin, { ConfigOptions } from '@/components/mixins/newConfigMixin';
import { createStore } from '@/store';
import initStore from '@/common/initStore';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import { App as VueApp } from '@vue/runtime-core';
import { createSSRApp } from 'vue';

export default function buildApp(
	termboxRequest: TermboxRequest,
	services: TermboxServices,
	config: ConfigOptions,
): Promise<VueApp<unknown>> {
	const store = createStore( services );
	const app = createSSRApp( App )
		.mixin( newConfigMixin( config ) )
		.directive( 'inlanguage', inlanguage )
		.directive( 'focus', focus )
		.use( store );
	return initStore( store, termboxRequest ).then( () => app );
}
