import Vue, {
	ComponentOptions,
	VueConstructor,
} from 'vue';
import { Vue3LikeApp } from '../common/buildApp';

export function createMwApp( componentOptions: ComponentOptions<Vue> ): Vue3LikeApp {
	const App = Vue.extend( componentOptions ) as VueConstructor & Vue3LikeApp;
	App.mount = function ( selector ) {
		const app = new App();
		app.$mount( selector );
	};
	return App;
}
