import { mount, shallowMount } from '@vue/test-utils';
import TermBox from '@/components/TermBox.vue';
import EditTools from '@/components/EditTools.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import { createStore } from '@/store';
import {
	NS_ENTITY,
	NS_LINKS,
	NS_USER,
	NS_LANGUAGE,
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
	ENTITY_ROLLBACK,
} from '@/store/entity/actionTypes';
import { EDITMODE_SET } from '@/store/mutationTypes';
import newFingerprintable from '../../newFingerprintable';
import { ENTITY_UPDATE } from '@/store/entity/mutationTypes';
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import Vue from 'vue';
import { MessageKeys } from '@/common/MessageKeys';
import mockMessageMixin from '../store/mockMessageMixin';
import createMockableStore from '../store/createMockableStore';
import newConfigMixin from '@/components/mixins/newConfigMixin';

Vue.mixin( newConfigMixin( { textFieldCharacterLimit: 0 } ) );

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
					const message = 'edit';
					const wrapper = shallowMount( TermBox, {
						stubs: { EditTools, EventEmittingButton },
						store,
						mixins: [ mockMessageMixin( {
							[ MessageKeys.EDIT ]: message,
						} ) ],
					} );

					const editPen = wrapper.find( EditTools ).find( '.wb-ui-event-emitting-button--edit' );

					expect( editPen.exists() ).toBeTruthy();
					expect( editPen.attributes() ).toHaveProperty( 'href', editLinkUrl );
					expect( editPen.props( 'message' ) ).toBe( message );
				} );

				it( 'emitted edit event puts store into editMode', async () => {
					const mockActivateEditMode = jest.fn().mockReturnValue( Promise.resolve() );
					const store = createMockableStore( {
						actions: {
							[ EDITMODE_ACTIVATE ]: mockActivateEditMode,
						},
					} );
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );

					const wrapper = shallowMount( TermBox, {
						store,
						stubs: { EditTools, EventEmittingButton },
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--edit' ).vm.$emit( 'click' );

					expect( mockActivateEditMode ).toHaveBeenCalled();
				} );
			} );

			describe( 'Publish', () => {
				it( 'is there in edit mode', () => {
					const store = createStore();
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );
					const message = 'publish';
					const publish = shallowMount( TermBox, {
						stubs: { EditTools, EventEmittingButton },
						store,
						mixins: [ mockMessageMixin( {
							[ MessageKeys.PUBLISH ]: message,
						} ) ],
					} ).find( EditTools ).find( '.wb-ui-event-emitting-button--publish' );

					expect( publish.exists() ).toBeTruthy();
					expect( publish.props( 'message' ) ).toBe( message );
				} );

				it( 'emitted publish event triggers entity save and deactivates edit mode', async () => {
					const entitySavePromise = Promise.resolve();
					const mockEntitySave = jest.fn().mockReturnValue( entitySavePromise );
					const mockDeactivateEditMode = jest.fn().mockReturnValue( Promise.resolve() );
					const store = createMockableStore( {
						modules: {
							[ NS_ENTITY ]: {
								actions: {
									[ ENTITY_SAVE ]: mockEntitySave,
								},
							},
						},
						actions: {
							[ EDITMODE_DEACTIVATE ]: mockDeactivateEditMode,
						},
					} );
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );

					const wrapper = shallowMount( TermBox, {
						store,
						stubs: { EditTools, EventEmittingButton },
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--publish' ).vm.$emit( 'click' );

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
					const message = 'cancel';
					const cancel = shallowMount( TermBox, {
						stubs: { EditTools, EventEmittingButton },
						store,
						mixins: [ mockMessageMixin( {
							[ MessageKeys.CANCEL ]: message,
						} ) ],
					} ).find( EditTools ).find( '.wb-ui-event-emitting-button--cancel' );

					expect( cancel.exists() ).toBeTruthy();
					expect( cancel.props( 'message' ) ).toBe( message );
				} );

				it( 'emitted cancel event triggers entity rollback and deactivates edit mode', async () => {
					const mockDeactivateEditMode = jest.fn().mockReturnValue( Promise.resolve() );
					const entityRollbackPromise = Promise.resolve();
					const mockEntityRollback = jest.fn().mockReturnValue( entityRollbackPromise );
					const store = createMockableStore( {
						actions: {
							[ EDITMODE_DEACTIVATE ]: mockDeactivateEditMode,
						},
						modules: {
							[ NS_ENTITY ]: {
								actions: {
									[ ENTITY_ROLLBACK ]: mockEntityRollback,
								},
							},
						},
					} );
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( EDITMODE_SET ), true );

					const wrapper = shallowMount( TermBox, {
						store,
						stubs: { EditTools, EventEmittingButton },
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--cancel' ).vm.$emit( 'click' );

					expect( mockEntityRollback ).toHaveBeenCalled();
					return entityRollbackPromise.then( () => {
						expect( mockDeactivateEditMode ).toHaveBeenCalled();
					} );
				} );

				it( 'resets the entity to its state before editing started', async () => {
					const store = createStore();

					const originalLabel = 'Kartoffel';
					const entity = newFingerprintable( {
						labels: { de: originalLabel },
						descriptions: { de: 'Art der Gattung Nachtschatten (Solanum)' },
						aliases: { de: [ 'Erdapfel', 'Solanum tuberosum' ] },
					} );

					const languageDe: Language = {
						code: 'de',
						directionality: 'ltr',
					};

					store.commit( mutation( NS_USER, LANGUAGE_INIT ), languageDe.code );
					store.commit(
						mutation( NS_LANGUAGE, LANGUAGE_UPDATE ),
						{
							de: languageDe,
						},
					);
					store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
					store.commit( mutation( NS_ENTITY, ENTITY_UPDATE ), entity );

					const wrapper = mount( TermBox, {
						store,
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--edit' ).vm.$emit( 'click' );

					const labelEdit = wrapper.find( '.wb-ui-label-edit' );
					( labelEdit.element as HTMLTextAreaElement ).value = 'foo';
					labelEdit.trigger( 'input' );

					await wrapper.find( '.wb-ui-event-emitting-button--cancel' ).vm.$emit( 'click' );

					return Vue.nextTick().then( () => {
						const label = wrapper.find( '.wb-ui-label' );
						expect( label.text() ).toBe( originalLabel );
					} );
				} );
			} );
		} );

		it( 'renders publish and cancel in edit mode', () => {
			const store = createStore();
			store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
			store.commit( mutation( EDITMODE_SET ), true );

			const wrapper = shallowMount( TermBox, {
				stubs: { EditTools, EventEmittingButton },
				store,
			} );

			expect( wrapper.find( '.wb-ui-event-emitting-button--publish' ).exists() ).toBe( true );
			expect( wrapper.find( '.wb-ui-event-emitting-button--cancel' ).exists() ).toBe( true );
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
