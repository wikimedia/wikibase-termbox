import App from '@/components/App.vue';
import { createStore } from '@/store';
import TermboxServices from '@/common/TermboxServices';
import TermboxRequest from '@/common/TermboxRequest';
import getChildComponents from './getChildComponents';

export default ( termboxRequest: TermboxRequest, services: TermboxServices ): Promise<App> => {
	const store = createStore( services );
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
