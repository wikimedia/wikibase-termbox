import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { NS_MESSAGES } from '@/store/namespaces';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { NS_USER } from '@/store/namespaces';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { MessageKeys } from '@/common/MessageKeys';

describe( 'InMoreLanguagesExpandable', () => {

	it( 'should show the user\'s preferred languages by default', () => {
		const store = createStore();
		const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
		expect( wrapper.find( InMoreLanguages ).exists() ).toBeTruthy();
	} );

	describe( 'toggle button', () => {
		it( 'has a button saying "in more languages"', () => {
			const expectedLinkText = 'moar languages';
			const userLanguage = 'en';
			const store = createStore();

			store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
			store.commit( mutation( NS_MESSAGES, MESSAGES_INIT ), {
				[ userLanguage ]: {
					[ MessageKeys.IN_MORE_LANGUAGES ]: expectedLinkText,
				},
			} );

			const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );

			expect( wrapper.find( '.wikibase-termbox-subsection-switch span' ).text() ).toBe( expectedLinkText );
		} );

		it( 'toggle collapses/expands the user\'s preferred languages on click', () => {
			const store = createStore();
			const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
			wrapper.find( '.wikibase-termbox-subsection-switch' ).trigger( 'click' );

			expect( wrapper.find( InMoreLanguages ).exists() ).toBeFalsy();
		} );
	} );

} );
