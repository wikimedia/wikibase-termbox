import InMoreLanguages from '@/components/InMoreLanguages.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import { shallowMount, WrapperArray } from '@vue/test-utils';
import { SECONDARY_LANGUAGES_INIT } from '@/store/user/mutationTypes';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_USER } from '@/store/namespaces';

describe( 'InMoreLanguages', () => {

	it( 'shows a list of MonolingualFingerprintViews in the user\'s top secondary languages', () => {
		const secondaryLanguages = [ 'en', 'fr', 'jp' ];
		const store = createStore();

		store.commit( mutation( NS_USER, SECONDARY_LANGUAGES_INIT ), secondaryLanguages );

		const wrapper = shallowMount( InMoreLanguages, { store } );
		const fingerprints: WrapperArray<MonolingualFingerprintView> = wrapper.findAll( MonolingualFingerprintView );

		expect( fingerprints ).toHaveLength( 3 );

		expect( fingerprints.at( 0 ).props( 'languageCode' ) ).toBe( secondaryLanguages[ 0 ] );
		expect( fingerprints.at( 1 ).props( 'languageCode' ) ).toBe( secondaryLanguages[ 1 ] );
		expect( fingerprints.at( 2 ).props( 'languageCode' ) ).toBe( secondaryLanguages[ 2 ] );
	} );

	it( 'shows an expandable list of all entered languages', () => {
		const store = createStore();
		const wrapper = shallowMount( InMoreLanguages, { store } );

		expect( wrapper.find( AllEnteredLanguagesExpandable ).exists() ).toBeTruthy();
	} );

} );
