import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import App from '@/components/App.vue';
import { createStore } from '@/store';
import TermboxRequest from '@/common/TermboxRequest';
import { NS_ENTITY, NS_LANGUAGE, NS_USER, NS_LINKS } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/language/actionTypes';
import { ENTITY_INIT } from '@/store/entity/actionTypes';
import { LANGUAGE_PREFERENCE, USER_NAME_SET, USER_PREFERENCES_INIT } from '@/store/user/actionTypes';
import { LINKS_INIT } from '@/store/links/actionTypes';
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

	it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
		const languageCode = 'ar';
		const inlanguage = jest.fn();

		shallowMount( App, {
			store: newInitializedStore(),
			directives: {
				inlanguage,
			},
		} );

		expect( inlanguage ).toHaveBeenCalledTimes( 1 );
		expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
	} );

	it( 'loads required data in asyncData', () => {
		const entity = 'Q123';
		const revision = 31510;
		const primaryLanguage = 'en';
		const preferredLanguages = [ 'de', 'en', 'pl', 'it', 'zh' ];
		const links = {
			editLinkUrl: '/edit/Q123',
			loginLinkUrl: '/login',
			signUpLinkUrl: '/signUp',
		};
		const user = 'Lord Voldemort';

		const store = {
			dispatch: jest.fn(),
		};
		const request = new TermboxRequest( primaryLanguage, entity, revision, links, preferredLanguages, user );

		return ( App as any ).asyncData( store, request ).then( () => {
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_LANGUAGE, LANGUAGE_INIT ) );
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_ENTITY, ENTITY_INIT ),
				{ entity, revision },
			);
			expect( store.dispatch ).toHaveBeenCalledWith(
				action( NS_USER, LANGUAGE_PREFERENCE ),
				{ primaryLanguage, preferredLanguages },
			);
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_LINKS, LINKS_INIT ), links );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_USER, USER_NAME_SET ), user );
			expect( store.dispatch ).toHaveBeenCalledWith( action( NS_USER, USER_PREFERENCES_INIT ) );
		} );
	} );

} );
