import { shallowMount } from '@vue/test-utils';
import TermBox from '@/components/TermBox.vue';
import EditTools from '@/components/EditTools.vue';
import EditPen from '@/components/EditPen.vue';
import Publish from '@/components/Publish.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
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

	it( 'contains a MonolingualFingerprintView of the user\'s primary language', () => {
		const store = createStore();
		const userLanguage = 'en';
		store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage );
		const wrapper = shallowMount( TermBox, { store } );

		expect( wrapper.find( MonolingualFingerprintView ).props() )
			.toHaveProperty( 'languageCode', userLanguage );
		expect( wrapper.find( MonolingualFingerprintView ).props() )
			.toHaveProperty( 'isPrimary', true );
	} );

	describe( 'EditTools', () => {
		describe( 'given the entity is editable', () => {
			it( 'are there', () => {
				const store = createStore();
				store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
				const wrapper = shallowMount( TermBox, { store } );

				expect( wrapper.find( EditTools ).exists() ).toBeTruthy();
			} );

			it( 'have EditPen with correct link', () => {
				const store = createStore();
				const editLinkUrl = '/edit/Q42';
				store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
				store.commit( mutation( NS_LINKS, EDIT_LINK_URL_UPDATE ), editLinkUrl );
				const wrapper = shallowMount( TermBox, { store } );

				const editTools = wrapper.find( EditTools );
				const editPen = editTools.find( EditPen );

				expect( editPen.exists() ).toBeTruthy();
				expect( editTools ).toHaveSlotWithContent( 'edit', editPen );
				expect( editPen.props() )
					.toHaveProperty( 'href', editLinkUrl );
			} );

			it( 'have Publish', () => {
				const store = createStore();
				store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
				const wrapper = shallowMount( TermBox, { store } );

				const editTools = wrapper.find( EditTools );
				const publish = editTools.find( Publish );

				expect( publish.exists() ).toBeTruthy();
				expect( editTools ).toHaveSlotWithContent( 'publish', publish );
			} );
		} );

		it( 'given the entity is not editable are not there', () => {
			const store = createStore();
			store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), false );
			const wrapper = shallowMount( TermBox, { store } );

			expect( wrapper.find( EditTools ).exists() ).toBeFalsy();
		} );
	} );

	it( 'shows a list of the user\'s top secondary languages', () => {
		const store = createStore();
		const wrapper = shallowMount( TermBox, { store } );

		expect( wrapper.find( InMoreLanguagesExpandable ).exists() ).toBeTruthy();
	} );

} );
