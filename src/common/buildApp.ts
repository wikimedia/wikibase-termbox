import App from '@/components/App.vue';
import store from '@/store';
import TermboxRequest from '@/common/TermboxRequest';
import { NS_ENTITY } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import Vue from 'vue';

export default ( req: TermboxRequest ) => {

	store.commit(
		`${NS_ENTITY}/${ENTITY_INIT}`,
		req.entity,
	);

	return new Vue( {
		store,
		render: ( h ) => h( App ),
	} );

};
