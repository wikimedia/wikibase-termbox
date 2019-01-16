import { shallowMount } from '@vue/test-utils';
import TermBox from '@/components/TermBox.vue';
import EditPen from '@/components/EditPen.vue';
import Fingerprint from '@/components/Fingerprint.vue';
import { createStore } from '@/store';
import {
	NS_ENTITY,
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import { EDITABILITY_UPDATE } from '@/store/entity/mutationTypes';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';

describe( 'TermBox.vue', () => {

	it( 'contains a Fingerprint of the user\'s primary language', () => {
		const store = createStore();
		const userLanguage = 'en';
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
		const wrapper = shallowMount( TermBox, { store } );

		expect( wrapper.find( Fingerprint ).props() )
			.toHaveProperty( 'languageCode', userLanguage );
		expect( wrapper.find( Fingerprint ).props() )
			.toHaveProperty( 'isPrimary', true );
	} );

	describe( 'edit pen', () => {
		it( 'is there given the entity is editable', () => {
			const store = createStore();
			const editLinkUrl = '/edit/Q42';
			store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
			store.commit( mutation( NS_LINKS, EDIT_LINK_URL_UPDATE ), editLinkUrl );
			const wrapper = shallowMount( TermBox, { store } );

			expect( wrapper.find( EditPen ).props() )
				.toHaveProperty( 'href', editLinkUrl );
		} );

		it( 'is not there given the entity is not editable', () => {
			const store = createStore();
			store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), false );
			const wrapper = shallowMount( TermBox, { store } );

			expect( wrapper.find( EditPen ).exists() ).toBeFalsy();
		} );
	} );

} );
