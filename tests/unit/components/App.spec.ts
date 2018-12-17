import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/components/App.vue';
import { createStore } from '@/store';

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'App.vue', () => {
	it( 'renders the mountable root element', () => {
		const store = createStore();

		const wrapper = shallowMount( App, { store, localVue } );
		expect( wrapper.classes() ).toEqual( [ 'wikibase-entitytermsview' ] );
	} );

} );
