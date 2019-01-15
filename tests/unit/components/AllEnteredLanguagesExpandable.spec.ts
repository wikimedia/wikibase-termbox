import { shallowMount } from '@vue/test-utils';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';
import { createStore } from '@/store';
import {
	NS_USER,
	NS_MESSAGES,
} from '@/store/namespaces';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';

describe( 'AllEnteredLanguagesExpandable', () => {
	const store = createStore();
	const frAllShowMessages = 'Alle eingegebenen Sprachen';

	store.commit(
		mutation( NS_MESSAGES, MESSAGES_INIT ),
		{
			fr: {
				'wikibase-entitytermsforlanguagelistview-more':	frAllShowMessages,
			},
		},
	);

	store.commit( mutation( NS_USER, LANGUAGE_INIT ), 'fr' );

	it( 'has a toggle button', () => {
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, { store } );

		expect( wrapper.find( '.wikibase-termbox-subsection-switch > a' ).exists() ).toBeTruthy();
	} );

	it( 'does not expand all entered languages by default', () => {
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, { store } );
		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeFalsy();
	} );

	it( 'expands all entered languages on click', () => {
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, { store } );
		wrapper.find( '.wikibase-termbox-subsection-switch > a' ).trigger( 'click' );

		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeTruthy();
	} );

} );
