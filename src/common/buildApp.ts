import App from '@/components/App.vue';
import { createStore } from '@/store';
import initStore from '@/common/initStore';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import Vue from 'vue';

export default ( termboxRequest: TermboxRequest, services: TermboxServices ): Promise<Vue> => {
	const store = createStore( services );
	const app = new App( {
		store,
	} );
	return initStore( store, termboxRequest ).then( () => app );
};
