import { mount, shallowMount } from '@vue/test-utils';
import { Store } from 'vuex';
import TermBox from '@/components/TermBox.vue';
import EditTools from '@/components/EditTools.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import MonolingualFingerprintView from '@/components/MonolingualFingerprintView.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import Modal from '@/components/Modal.vue';
import Overlay from '@/components/Overlay.vue';
import IndeterminateProgressBar from '@/components/IndeterminateProgressBar.vue';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import MessageBanner from '@/components/MessageBanner.vue';
import IconMessageBox from '@/components/IconMessageBox.vue';
import { createStore } from '@/store';
import {
	NS_ENTITY,
	NS_LANGUAGE,
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import {
	EDITABILITY_UPDATE,
	ENTITY_UPDATE,
} from '@/store/entity/mutationTypes';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import {
	LANGUAGE_INIT,
	USER_SET_NAME,
	USER_SET_PREFERENCE,
} from '@/store/user/mutationTypes';
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
import Language from '@/datamodel/Language';
import { LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import Vue from 'vue';
import { MessageKey } from '@/common/MessageKey';
import mockMessageMixin from '../store/mockMessageMixin';
import createMockableStore from '../store/createMockableStore';
import { UserPreference } from '@/common/UserPreference';
import { USER_PREFERENCE_SET } from '@/store/user/actionTypes';
import newConfigMixin, { ConfigOptions } from '@/components/mixins/newConfigMixin';

function shallowMountWithStore( store: Store<any> ) {
	return shallowMount( TermBox, {
		store,
		stubs: { EditTools, EventEmittingButton, LicenseAgreement, Overlay, Modal },
	} );
}

function setStoreInEditMode( store: Store<any> ) {
	store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
	store.commit( mutation( EDITMODE_SET ), true );
}

function createStoreInEditMode() {
	const store = createStore();

	setStoreInEditMode( store );

	return store;
}

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
					store.commit( mutation( NS_LINKS, LINKS_UPDATE ), { editLinkUrl } );
					const message = 'edit';
					const wrapper = shallowMount( TermBox, {
						stubs: { EditTools, EventEmittingButton },
						store,
						mixins: [ mockMessageMixin( {
							[ MessageKey.EDIT ]: message,
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

				describe( 'AnonEditWarning', () => {
					it( 'is shown in a modal overlay for anonymous users', async () => {
						const store = createStore();
						store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
						const wrapper = shallowMount( TermBox, {
							store,
							stubs: { EditTools, EventEmittingButton, Overlay, Modal, AnonEditWarning },
						} );

						await wrapper.find( '.wb-ui-event-emitting-button--edit' ).vm.$emit( 'click' );

						expect(
							wrapper.find( '.wb-ui-overlay .wb-ui-modal' ).find( AnonEditWarning ).exists(),
						).toBeTruthy();
					} );

					it( 'is not shown for logged in users', async () => {
						const store = createStore();
						store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
						store.commit( mutation( NS_USER, USER_SET_NAME ), 'Lord Voldemort' );
						const wrapper = shallowMount( TermBox, {
							store,
							stubs: { EditTools, EventEmittingButton, AnonEditWarning },
						} );

						await wrapper.find( '.wb-ui-event-emitting-button--edit' ).vm.$emit( 'click' );

						expect( wrapper.find( AnonEditWarning ).exists() ).toBeFalsy();
					} );

					it( `is not shown if ${ UserPreference.HIDE_ANON_EDIT_WARNING } is set`, async () => {
						const store = createStore();
						store.commit( mutation( NS_ENTITY, EDITABILITY_UPDATE ), true );
						store.commit(
							mutation( NS_USER, USER_SET_PREFERENCE ),
							{ name: UserPreference.HIDE_ANON_EDIT_WARNING, value: true },
						);
						const wrapper = shallowMount( TermBox, {
							store,
							stubs: { EditTools, EventEmittingButton, AnonEditWarning },
						} );

						await wrapper.find( '.wb-ui-event-emitting-button--edit' ).vm.$emit( 'click' );

						expect( wrapper.find( AnonEditWarning ).exists() ).toBeFalsy();
					} );

					it( 'can be dismissed', () => {
						const wrapper = shallowMount( TermBox, {
							store: createStore(),
							data: () => ( { showEditWarning: true } ),
						} );

						wrapper.find( AnonEditWarning ).vm.$emit( 'dismiss' );

						expect( wrapper.find( Modal ).exists() ).toBeFalsy();
					} );
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
							[ MessageKey.PUBLISH ]: message,
						} ) ],
					} ).find( EditTools ).find( '.wb-ui-event-emitting-button--publish' );

					expect( publish.exists() ).toBeTruthy();
					expect( publish.props( 'message' ) ).toBe( message );
				} );

				it( 'shows the LicenseAgreement in a modal overlay when clicked', async () => {
					const wrapper = shallowMountWithStore( createStoreInEditMode() );

					await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );

					expect(
						wrapper.find( '.wb-ui-overlay .wb-ui-modal' ).find( LicenseAgreement ).exists(),
					).toBeTruthy();
				} );

				it( `saves w/o overlay when ${ UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION } is set`, async () => {
					const entitySave = jest.fn().mockReturnValue( Promise.resolve() );
					const deactivateEditMode = jest.fn();
					const copyrightVersion = 'wikibase-1';
					const store = createMockableStore( {
						actions: { [ EDITMODE_DEACTIVATE ]: deactivateEditMode },
						modules: {
							[ NS_ENTITY ]: {
								actions: { [ ENTITY_SAVE ]: entitySave },
							},
						},
					} );
					setStoreInEditMode( store );
					store.commit( mutation( NS_USER, USER_SET_PREFERENCE ), {
						name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
						value: copyrightVersion,
					} );
					const wrapper = shallowMount( TermBox, {
						store,
						stubs: { LicenseAgreement, EventEmittingButton, EditTools },
						mixins: [ newConfigMixin( { copyrightVersion } as ConfigOptions ) ],
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
					expect( wrapper.find( LicenseAgreement ).exists() ).toBeFalsy();
					expect( entitySave ).toHaveBeenCalled();

					await Vue.nextTick();
					expect( deactivateEditMode ).toHaveBeenCalled();
				} );

				it( 'shows an error message when saving fails', async () => {
					const entitySave = jest.fn().mockReturnValue( Promise.reject() );
					const deactivateEditMode = jest.fn();
					const copyrightVersion = 'wikibase-1';
					const store = createMockableStore( {
						actions: { [ EDITMODE_DEACTIVATE ]: deactivateEditMode },
						modules: {
							[ NS_ENTITY ]: {
								actions: { [ ENTITY_SAVE ]: entitySave },
							},
						},
					} );
					setStoreInEditMode( store );
					store.commit( mutation( NS_USER, USER_SET_PREFERENCE ), {
						name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
						value: copyrightVersion,
					} );
					window.scrollBy = jest.fn(); // used in MessageBanner
					const errorHeading = 'something went wrong';
					const errorMessage = 'oopsie. try clicking the button again';
					const wrapper = shallowMount( TermBox, {
						store,
						stubs: { EditTools, EventEmittingButton, MessageBanner },
						mixins: [
							newConfigMixin( { copyrightVersion } as ConfigOptions ),
							mockMessageMixin( {
								[ MessageKey.SAVE_ERROR_HEADING ]: errorHeading,
								[ MessageKey.SAVE_ERROR_MESSAGE ]: errorMessage,
							} ),
						],
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
					await Vue.nextTick();

					expect( entitySave ).toHaveBeenCalled();
					const messageBanner = wrapper.find( MessageBanner );
					expect( messageBanner.exists() ).toBeTruthy();
					expect( messageBanner.text() ).toContain( errorHeading );

					const errorMessageBox = messageBanner.find( IconMessageBox );
					expect( errorMessageBox.props( 'type' ) ).toBe( 'error' );
					expect( errorMessageBox.text() ).toBe( errorMessage );

					expect( deactivateEditMode ).not.toHaveBeenCalled();
				} );

				it( 'removes the error if saving was successful at the second attempt', async () => {
					const entitySave = jest.fn()
						.mockReturnValueOnce( Promise.reject() )
						.mockReturnValueOnce( Promise.resolve() );
					const deactivateEditMode = jest.fn();
					const copyrightVersion = 'wikibase-1';
					const store = createMockableStore( {
						actions: { [ EDITMODE_DEACTIVATE ]: deactivateEditMode },
						modules: {
							[ NS_ENTITY ]: {
								actions: { [ ENTITY_SAVE ]: entitySave },
							},
						},
					} );
					setStoreInEditMode( store );
					store.commit( mutation( NS_USER, USER_SET_PREFERENCE ), {
						name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
						value: copyrightVersion,
					} );
					const wrapper = shallowMount( TermBox, {
						store,
						stubs: { EditTools, EventEmittingButton },
						mixins: [ newConfigMixin( { copyrightVersion } as ConfigOptions ) ],
					} );

					await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
					await Vue.nextTick();

					expect( entitySave ).toHaveBeenCalledTimes( 1 );
					expect( wrapper.find( MessageBanner ).exists() ).toBeTruthy();

					await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
					await Vue.nextTick();

					expect( wrapper.find( MessageBanner ).exists() ).toBeFalsy();
					expect( deactivateEditMode ).toHaveBeenCalled();
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
							[ MessageKey.CANCEL ]: message,
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

					await wrapper.find( '.wb-ui-event-emitting-button--edit' ).trigger( 'click' );

					const labelEdit = wrapper.find( '.wb-ui-label-edit' );
					( labelEdit.element as HTMLTextAreaElement ).value = 'foo';
					labelEdit.trigger( 'input' );

					await wrapper.find( '.wb-ui-event-emitting-button--cancel' ).trigger( 'click' );

					return Vue.nextTick().then( () => {
						const label = wrapper.find( '.wb-ui-label' );
						expect( label.text() ).toBe( originalLabel );
					} );
				} );
			} );
		} );

		describe( 'LicenseAgreement', () => {
			it( 'saves on clicking publish', async () => {
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
						[ NS_USER ]: {
							actions: { [ USER_PREFERENCE_SET ]: jest.fn() },
						},
					},
					actions: {
						[ EDITMODE_DEACTIVATE ]: mockDeactivateEditMode,
					},
				} );

				setStoreInEditMode( store );

				const wrapper = shallowMountWithStore( store );

				await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
				await wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' ).trigger( 'click' );

				expect( mockEntitySave ).toHaveBeenCalled();
				entitySavePromise.then( () => {
					expect( mockDeactivateEditMode ).toHaveBeenCalled();
				} );
				expect( wrapper.find( Modal ).exists() ).toBeFalsy();
			} );

			it( 'can be aborted', async () => {
				const wrapper = shallowMountWithStore( createStoreInEditMode() );

				await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
				await wrapper.find( '.wb-ui-event-emitting-button--normal' ).trigger( 'click' );

				expect( wrapper.find( Modal ).exists() ).toBeFalsy();
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

	it( 'shows an overlay with indeterminate progress bar while saving', async () => {
		const entitySave = jest.fn().mockReturnValue( Promise.resolve() );
		const copyrightVersion = 'wikibase-1';
		const store = createMockableStore( {
			modules: {
				[ NS_ENTITY ]: {
					actions: { [ ENTITY_SAVE ]: entitySave },
				},
			},
		} );
		setStoreInEditMode( store );
		store.commit( mutation( NS_USER, USER_SET_PREFERENCE ), {
			name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
			value: copyrightVersion,
		} );
		const wrapper = shallowMount( TermBox, {
			store,
			stubs: { LicenseAgreement, EventEmittingButton, EditTools },
			mixins: [ newConfigMixin( { copyrightVersion } as ConfigOptions ) ],
		} );

		await wrapper.find( '.wb-ui-event-emitting-button--publish' ).trigger( 'click' );
		expect( wrapper.find( Overlay ).exists() ).toBeTruthy();
		expect( wrapper.find( IndeterminateProgressBar ).exists() ).toBeTruthy();

		await Vue.nextTick();
		expect( wrapper.find( Overlay ).exists() ).toBeFalsy();
	} );

} );
