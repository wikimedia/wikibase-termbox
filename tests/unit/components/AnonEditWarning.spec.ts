import { shallowMount } from '@vue/test-utils';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import Checkbox from '@/components/Checkbox.vue';
import IconMessageBox from '@/components/IconMessageBox.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import { MessageKey } from '@/common/MessageKey';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import {
	NS_LINKS,
	NS_USER,
} from '@/store/namespaces';
import createMockableStore from '../store/createMockableStore';
import { USER_PREFERENCE_SET } from '@/store/user/actionTypes';
import { UserPreference } from '@/common/UserPreference';

const LOGIN_URL = '/login';
const SIGNUP_URL = '/signup';

function createStoreWithLinks() {
	const store = createStore();
	store.commit( mutation( NS_LINKS, LINKS_UPDATE ), { loginLinkUrl: LOGIN_URL, signUpLinkUrl: SIGNUP_URL } );
	return store;
}

describe( 'AnonEditWarning', () => {

	it( 'has a heading', () => {
		const expectedHeading = 'you are not logged in';
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStore(),
			mixins: [ mockMessageMixin( {
				[ MessageKey.EDIT_WARNING_HEADING ]: expectedHeading,
			} ) ],
		} );

		expect( wrapper.find( '.wb-ui-anon-edit-warning__heading' ).text() )
			.toBe( expectedHeading );
	} );

	it( 'has a warning message', () => {
		const expectedMessage = 'Your IP address will be publicly visible. [...]';
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStore(),
			mixins: [ mockMessageMixin( {
				[ MessageKey.EDIT_WARNING_MESSAGE ]: expectedMessage,
			} ) ],
		} );

		expect( wrapper.find( IconMessageBox ).props( 'type' ) ).toBe( 'warning' );
		expect( wrapper.find( IconMessageBox ).text() ).toBe( expectedMessage );
	} );

	it( 'has a login button acting as link that also causes preference persistence', () => {
		const buttonLabel = 'login';
		const persistUserPreference = jest.fn();
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStoreWithLinks(),
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKey.LOGIN ]: buttonLabel,
			} ) ],
			methods: {
				persistUserPreference,
			},
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		expect( button.props( 'href' ) ).toBe( LOGIN_URL );
		expect( button.props( 'preventDefault' ) ).toBe( false );

		button.trigger( 'click' );
		expect( persistUserPreference ).toHaveBeenCalled();
	} );

	it( 'has a sign-up button acting as link that also causes preference persistence', () => {
		const buttonLabel = 'sign up';
		const persistUserPreference = jest.fn();
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStoreWithLinks(),
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKey.CREATE_ACCOUNT ]: buttonLabel,
			} ) ],
			methods: {
				persistUserPreference,
			},
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--framelessProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		expect( button.props( 'href' ) ).toBe( SIGNUP_URL );
		expect( button.props( 'preventDefault' ) ).toBe( false );

		button.trigger( 'click' );
		expect( persistUserPreference ).toHaveBeenCalled();
	} );

	it( 'has a dismiss button that emits an event and also causes preference persistence', () => {
		const buttonLabel = 'edit w/o login';
		const persistUserPreference = jest.fn();
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStore(),
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKey.EDIT_WARNING_DISMISS_BUTTON ]: buttonLabel,
			} ) ],
			methods: {
				persistUserPreference,
			},
		} );

		const button = wrapper.find( '.wb-ui-event-emitting-button--normal' );
		expect( button.text() ).toBe( buttonLabel );

		button.trigger( 'click' );
		expect( wrapper.emitted( 'dismiss' ) ).toBeTruthy();
		expect( persistUserPreference ).toHaveBeenCalled();
	} );

	it( 'has a checkbox that is checked by default', () => {
		const wrapper = shallowMount( AnonEditWarning, { store: createStore() } );

		expect( wrapper.find( Checkbox ).props( 'value' ) ).toBeTruthy();
	} );

	it( 'is focused', () => {
		const focus = jest.fn();
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStoreWithLinks(),
			directives: {
				focus,
			},
		} );

		expect( focus.mock.calls[ 0 ][ 0 ] ).toBe( wrapper.element );
	} );

	describe( `saves ${UserPreference.HIDE_ANON_EDIT_WARNING} user preference`, () => {
		it( 'as true when warnRecurringly is false', () => {
			const mockUserPreferenceSet = jest.fn();
			const wrapper = shallowMount( AnonEditWarning, {
				store: createMockableStore( {
					modules: {
						[ NS_USER ]: {
							actions: {
								[ USER_PREFERENCE_SET ]: mockUserPreferenceSet,
							},
						},
					},
				} ),
				data: () => ( {
					warnRecurringly: false,
				} ),
			} );

			( wrapper.vm as any ).persistUserPreference();

			expect( mockUserPreferenceSet ).toHaveBeenCalledWith(
				expect.anything(),
				{
					name: UserPreference.HIDE_ANON_EDIT_WARNING,
					value: true,
				},
				undefined,
			);
		} );

		it( 'as false when warnRecurringly is true', () => {
			const mockUserPreferenceSet = jest.fn();
			const wrapper = shallowMount( AnonEditWarning, {
				store: createMockableStore( {
					modules: {
						[ NS_USER ]: {
							actions: {
								[ USER_PREFERENCE_SET ]: mockUserPreferenceSet,
							},
						},
					},
				} ),
				data: () => ( {
					warnRecurringly: true,
				} ),
			} );
			( wrapper.vm as any ).persistUserPreference();

			expect( mockUserPreferenceSet ).toHaveBeenCalledWith(
				expect.anything(),
				{
					name: UserPreference.HIDE_ANON_EDIT_WARNING,
					value: false,
				},
				undefined,
			);
		} );
	} );
} );
