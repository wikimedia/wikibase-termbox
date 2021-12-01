import InMoreLanguages from '@/components/InMoreLanguages.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import { shallowMount } from '@vue/test-utils';
import { SECONDARY_LANGUAGES_INIT } from '@/store/user/mutationTypes';
import { createStore } from '@/store';
import { mutation } from '@wmde/vuex-helpers/dist/namespacedStoreMethods';
import { NS_USER } from '@/store/namespaces';
import emptyServices from '../emptyServices';

describe( 'InMoreLanguages', () => {

	it( 'shows a list of MonolingualFingerprintViews in the user\'s top secondary languages', () => {
		const secondaryLanguages = [ 'en', 'fr', 'jp' ];
		const store = createStore( emptyServices as any );

		store.commit( mutation( NS_USER, SECONDARY_LANGUAGES_INIT ), secondaryLanguages );

		const wrapper = shallowMount( InMoreLanguages, { global: { plugins: [ store ] } } );
		const fingerprints = wrapper.findAllComponents( MonolingualFingerprintView );

		expect( fingerprints ).toHaveLength( 3 );

		expect( fingerprints[ 0 ].props( 'languageCode' ) ).toBe( secondaryLanguages[ 0 ] );
		expect( fingerprints[ 1 ].props( 'languageCode' ) ).toBe( secondaryLanguages[ 1 ] );
		expect( fingerprints[ 2 ].props( 'languageCode' ) ).toBe( secondaryLanguages[ 2 ] );
	} );

	it( 'shows an expandable list of all entered languages', () => {
		const store = createStore( emptyServices as any );
		const wrapper = shallowMount( InMoreLanguages, { global: { plugins: [ store ] } } );

		expect( wrapper.findComponent( AllEnteredLanguagesExpandable ).exists() ).toBeTruthy();
	} );

} );
