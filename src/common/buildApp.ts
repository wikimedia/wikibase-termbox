import App from '@/components/App.vue';
import store from '@/store';
import TermboxRequest from '@/common/TermboxRequest';
import { NS_ENTITY, NS_USER } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import Vue from 'vue';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';

export default ( req: TermboxRequest ) => {

	store.commit(
		`${NS_ENTITY}/${ENTITY_INIT}`,
		req.entity,
	);

	store.commit(
		`${NS_USER}/${LANGUAGE_INIT}`,
		req.language,
	);

	return new Vue( {
		store,
		render: ( h ) => h( App ),
	} );

};
