import App from '@/components/App.vue';
import { createStore } from '@/store';
import TermboxRequest from '@/common/TermboxRequest';
import getChildComponents from './getChildComponents';

export default ( termboxRequest: TermboxRequest ) => {
	const store = createStore();
	const app = new App( {
		store,
	} );

	const componentList = getChildComponents( app );
	return Promise.all( componentList.map( ( componentClass ) => {
		if ( componentClass.asyncData ) {
			return componentClass.asyncData(
				store,
				termboxRequest,
			);
		}
	} ) ).then( () => Promise.resolve( app ) );
};
