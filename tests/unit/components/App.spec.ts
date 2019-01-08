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
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { LANGUAGE_INIT as USER_LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { action, mutation } from '@/store/util';

const localVue = createLocalVue();
localVue.use( Vuex );

function newInitializedStore() {
	const store = createStore();

	store.commit( mutation( NS_USER, USER_LANGUAGE_INIT ), 'ar' );
	store.commit(
		mutation( NS_LANGUAGE, LANGUAGE_UPDATE ),
		{
			ar: { directionality: 'rtl' },
			en: { directionality: 'ltr' },
		},
	);

	return store;
}

describe( 'App.vue', () => {

	it( 'renders the mountable root element', () => {
		const wrapper = shallowMount( App, { store: newInitializedStore(), localVue } );
		expect( wrapper.classes() ).toContain( 'wikibase-entitytermsview' );
	} );

	test.each( [
		[ 'en', 'ltr' ],
		[ 'ar', 'rtl' ],
	] )(
		'includes the user language (%s) directionality (%s) in its root element',
		( lang: string, directionality: string ) => {
			const store = newInitializedStore();
			const wrapper = shallowMount( App, { store, localVue } );

			store.commit( mutation( NS_USER, USER_LANGUAGE_INIT ), lang );

			expect( wrapper.attributes( 'dir' ) ).toBe( directionality );
		},
	);

	it( 'loads required data in asyncData', () => {
		const entity = 'Q123';
		const language = 'en';
		const editLinkUrl = '/edit/term/data/of/Q123';

		const store = {
			dispatch: jest.fn(),
		};

		const request = new TermboxRequest( language, entity, editLinkUrl );

		return ( App as any ).asyncData( store, request ).then( () => {
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_LANGUAGE, LANGUAGE_INIT ) );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_ENTITY, ENTITY_INIT ), entity );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_USER, LANGUAGE_PREFERENCE ), language );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_LINKS, EDIT_LINK_URL_INIT ), editLinkUrl );
		} );
	} );

} );
