import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/components/App.vue';
import { createStore } from '@/store';
import TermboxRequest from '@/common/TermboxRequest';
import { NS_ENTITY, NS_LANGUAGE, NS_USER, NS_LINKS } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { LANGUAGE_PREFERENCE } from '@/store/user/actionTypes';
import { EDIT_LINK_URL_INIT } from '@/store/links/actionTypes';

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'App.vue', () => {

	it( 'renders the mountable root element', () => {
		const store = createStore();

		const wrapper = shallowMount( App, { store, localVue } );
		expect( wrapper.classes() ).toEqual( [ 'wikibase-entitytermsview' ] );
	} );

	it( 'loads required data in asyncData', () => {
		const entity = 'Q123';
		const language = 'en';
		const editLinkUrl = '/edit/term/data/of/Q123';

		const store = {
			dispatch: jest.fn(),
		};
		const request = new TermboxRequest( language, entity, editLinkUrl );

		return ( App as any ).asyncData( store, request ).then( () => {
			expect( store.dispatch ).toHaveBeenCalledWith( `${NS_LANGUAGE}/${LANGUAGE_INIT}` );
			expect( store.dispatch ).toHaveBeenCalledWith( `${NS_ENTITY}/${ENTITY_INIT}`, entity );
			expect( store.dispatch ).toHaveBeenCalledWith( `${NS_USER}/${LANGUAGE_PREFERENCE}`, language );
			expect( store.dispatch ).toHaveBeenCalledWith( `${NS_LINKS}/${EDIT_LINK_URL_INIT}`, editLinkUrl );
		} );
	} );

} );
