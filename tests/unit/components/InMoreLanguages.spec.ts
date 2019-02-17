import InMoreLanguages from '@/components/InMoreLanguages.vue';
import Fingerprint from '@/components/Fingerprint.vue';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import { shallowMount, WrapperArray } from '@vue/test-utils';
import { SECONDARY_LANGUAGES_INIT } from '@/store/user/mutationTypes';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_USER } from '@/store/namespaces';
import { USER_TOP_SECONDARY_LANGUAGES_LIMIT } from '@/common/constants';

describe( 'InMoreLanguages', () => {

	it( 'shows a list of Fingerprints in the user\'s top secondary languages', () => {
		const secondaryLanguages = [ 'en', 'fr', 'jp' ];
		const store = createStore();

		store.commit( mutation( NS_USER, SECONDARY_LANGUAGES_INIT ), secondaryLanguages );

		const wrapper = shallowMount( InMoreLanguages, { store } );
		const fingerprints: WrapperArray<Fingerprint> = wrapper.findAll( Fingerprint );

		expect( fingerprints ).toHaveLength( 3 );

		expect( fingerprints.at( 0 ).props( 'languageCode' ) ).toBe( secondaryLanguages[ 0 ] );
		expect( fingerprints.at( 1 ).props( 'languageCode' ) ).toBe( secondaryLanguages[ 1 ] );
		expect( fingerprints.at( 2 ).props( 'languageCode' ) ).toBe( secondaryLanguages[ 2 ] );
	} );

	it( 'limits the more languages list to the top secondary languages of the user', () => {
		const secondaryLanguages = [ 'en', 'fr', 'jp', 'hu', 'ko' ];
		const store = createStore();

		store.commit( mutation( NS_USER, SECONDARY_LANGUAGES_INIT ), secondaryLanguages );

		const wrapper = shallowMount( InMoreLanguages, { store } );
		const fingerprints: WrapperArray<Fingerprint> = wrapper.findAll( Fingerprint );

		expect( fingerprints ).toHaveLength( USER_TOP_SECONDARY_LANGUAGES_LIMIT );
	} );

	it( 'shows an expandable list of all entered languages', () => {
		const store = createStore();
		const wrapper = shallowMount( InMoreLanguages, { store } );

		expect( wrapper.find( AllEnteredLanguagesExpandable ).exists() ).toBeTruthy();
	} );

} );
