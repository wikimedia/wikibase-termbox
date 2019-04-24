import { shallowMount } from '@vue/test-utils';
import TermBox from '@/components/TermBox.vue';
import EditTools from '@/components/EditTools.vue';
import EditPen from '@/components/EditPen.vue';
import Publish from '@/components/Publish.vue';
import Cancel from '@/components/Cancel.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import { createStore } from '@/store';
import createEntityStoreModule from '@/store/entity';
import { actions as rootStoreActions } from '@/store/actions';
import {
	NS_ENTITY,
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import { EDITABILITY_UPDATE } from '@/store/entity/mutationTypes';
import { EDIT_LINK_URL_UPDATE } from '@/store/links/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';
import { mutation } from '@/store/util';
import {
	EDITMODE_ACTIVATE,
	EDITMODE_DEACTIVATE,
} from '@/store/actionTypes';
import {
	ENTITY_SAVE,
} from '@/store/entity/actionTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';

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

			describe( 'EditPen', () => {
				it( 'is there with correct link', () => {
					const store = createStore();
					const editLinkUrl = '/edit/Q42';
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( NS_LINKS, EDIT_LINK_URL_UPDATE ), editLinkUrl );
					const wrapper = shallowMount( TermBox, {
						stubs: { EditTools },
						store,
					} );

					const editPen = wrapper.find( EditTools ).find( EditPen );

					expect( editPen.exists() ).toBeTruthy();
					expect( editPen.props() )
						.toHaveProperty( 'href', editLinkUrl );
				} );

				it( 'emitted edit event puts store into editMode', async () => {
					const store = createStore();
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );

					const wrapper = shallowMount( TermBox, {
						store,
						stubs: {
							EditTools,
						},
					} );

					const mockActivateEditMode = jest.fn().mockReturnValue( Promise.resolve() );
					store.hotUpdate( {
						actions: {
							...rootStoreActions,
							[ EDITMODE_ACTIVATE ]: mockActivateEditMode,
						},
					} );

					await wrapper.find( EditPen ).vm.$emit( 'editing' );

					expect( mockActivateEditMode ).toHaveBeenCalled();
				} );
			} );

			describe( 'Publish', () => {
				it( 'is there in edit mode', () => {
					const store = createStore();
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );
					const wrapper = shallowMount( TermBox, {
						stubs: { EditTools },
						store,
					} );

					expect( wrapper.find( EditTools ).find( Publish ).exists() ).toBeTruthy();
				} );

				it( 'emitted publish event triggers entity save and deactivates edit mode', async () => {
					const store = createStore();
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );

					const wrapper = shallowMount( TermBox, {
						store,
						stubs: {
							EditTools,
						},
					} );

					const entitySavePromise = Promise.resolve();
					const mockEntitySave = jest.fn().mockReturnValue( entitySavePromise );
					const mockDeactivateEditMode = jest.fn().mockReturnValue( Promise.resolve() );
					store.hotUpdate( {
						modules: {
							[ NS_ENTITY ]: {
								...createEntityStoreModule(),
								actions: {
									[ ENTITY_SAVE ]: mockEntitySave,
								},
							},
						},
						actions: {
							...rootStoreActions,
							[ EDITMODE_DEACTIVATE ]: mockDeactivateEditMode,
						},
					} );

					await wrapper.find( Publish ).vm.$emit( 'publish' );

					expect( mockEntitySave ).toHaveBeenCalled();
					entitySavePromise.then( () => {
						expect( mockDeactivateEditMode ).toHaveBeenCalled();
					} );
				} );
			} );

			describe( 'Cancel', () => {
				it( 'is there in edit mode', () => {
					const store = createStore();
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );
					const wrapper = shallowMount( TermBox, {
						stubs: { EditTools },
						store,
					} );

					expect( wrapper.find( EditTools ).find( Cancel ).exists() ).toBeTruthy();
				} );

				it( 'emitted cancel event triggers entity rollback and deactivates edit mode', async () => {
					const store = createStore();
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );

					const wrapper = shallowMount( TermBox, {
						store,
						stubs: {
							EditTools,
						},
					} );

					const mockDeactivateEditMode = jest.fn().mockReturnValue( Promise.resolve() );
					store.hotUpdate( {
						actions: {
							...rootStoreActions,
							[ EDITMODE_DEACTIVATE ]: mockDeactivateEditMode,
						},
					} );

					await wrapper.find( Cancel ).vm.$emit( 'cancel' );

					expect( mockDeactivateEditMode ).toHaveBeenCalled();
				} );
			} );
		} );

		it( 'renders publish and cancel in edit mode', () => {
			const store = createStore();
			store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
			store.commit( mutation( EDITMODE_SET ), true );

			const wrapper = shallowMount( TermBox, {
				stubs: { EditTools },
				store,
			} );

			expect( wrapper.find( Publish ).exists() ).toBe( true );
			expect( wrapper.find( Cancel ).exists() ).toBe( true );
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
