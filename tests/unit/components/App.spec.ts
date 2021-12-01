import { shallowMount } from '@vue/test-utils';
import App from '@/components/App.vue';
import { createStore } from '@/store';
import { NS_LANGUAGE, NS_USER } from '@/store/namespaces';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { LANGUAGE_INIT as USER_LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import emptyServices from '../emptyServices';

function newInitializedStore() {
	const store = createStore( emptyServices as any );

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
		const wrapper = shallowMount( App, { global: {
			plugins: [ newInitializedStore() ],
		} } );
		expect( wrapper.classes() ).toContain( 'wikibase-entitytermsview' );
	} );

	it( 'delegates language attribute rendering to the v-inlanguage directive', () => {
		const languageCode = 'ar';
		const inlanguage = jest.fn();

		shallowMount( App, { global: {
			plugins: [ newInitializedStore() ],
			directives: {
				inlanguage,
			},
		} } );

		expect( inlanguage ).toHaveBeenCalledTimes( 1 );
		expect( inlanguage.mock.calls[ 0 ][ 1 ].value ).toBe( languageCode );
	} );

} );
