import App from '@/components/App.vue';
import store from '@/store';
import TermboxRequest from '@/common/TermboxRequest';

export default ( req: TermboxRequest ) => {

	return {
		store,
		app: new App( {
			store,
		} ),
	};

};
