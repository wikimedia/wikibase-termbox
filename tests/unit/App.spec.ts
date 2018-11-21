import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/components/App.vue';
import store from '@/store';
import { NS_ENTITY } from '@/store/namespaces';
import { ENTITY_INIT } from '@/store/entity/mutationTypes';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'App.vue', () => {
	it( 'renders the entity title', () => {
		const wrapper = shallowMount( App, { store, localVue } );
		store.commit(
			`${NS_ENTITY}/${ENTITY_INIT}`,
			new FingerprintableEntity( 'Q42', {}, {}, {} ),
		);
		expect( wrapper.text() ).toMatch( '(Q42)' );
		expect( wrapper.classes() ).toEqual( [ 'wikibase-entitytermsview' ] );
	} );

} );
