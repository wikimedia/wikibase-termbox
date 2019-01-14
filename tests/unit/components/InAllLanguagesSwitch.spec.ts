import Vuex from 'vuex';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import InAllLanguagesSwitch from '@/components/InAllLanguagesSwitch.vue';
import { createStore } from '@/store';
import {
	NS_USER,
	NS_MESSAGES,
} from '@/store/namespaces';
import { MESSAGES_INIT } from '@/store/messages/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';

const localVue = createLocalVue();
localVue.use( Vuex );

describe( 'InAllLanguagesSwitch.vue', () => {
	const store = createStore();
	const deAllShowMessages = 'Alle eingegebenen Sprachen';

	store.commit(
		mutation( NS_MESSAGES, MESSAGES_INIT ),
		{
			de: {
				'wikibase-entitytermsforlanguagelistview-more':	deAllShowMessages,
			},
		},
	);

	store.commit( mutation( NS_USER, LANGUAGE_INIT ), 'de' );

	it( 'renders the link', () => {
		const wrapper = shallowMount( InAllLanguagesSwitch, { store, localVue } );
		expect( wrapper.find( '.wikibase-termbox-subsection-switch__switch>a' ).text() ).toBe( deAllShowMessages );
	} );

	it( 'renders the reference correctly', () => {
		const wrapper = shallowMount( InAllLanguagesSwitch, { store, localVue } );
		expect(
			wrapper.find( '.wikibase-termbox-subsection-switch__switch>a' ).attributes( 'href' ),
		).toBe( '#' );
	} );
} );
