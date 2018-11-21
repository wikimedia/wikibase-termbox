import App from '@/components/App.vue';
import store from '@/store';
import TermboxRequest from '@/common/TermboxRequest';
import { NS_USER } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';

export default ( req: TermboxRequest ) => {

	store.commit(
		`${NS_USER}/${LANGUAGE_INIT}`,
		req.language,
	);

	return {
		store,
		app: new App( {
			store,
		} ),
	};

};
