import { shallowMount } from '@vue/test-utils';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import { MessageKeys } from '@/common/MessageKeys';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import { LINKS_UPDATE } from '@/store/links/mutationTypes';
import { NS_LINKS } from '@/store/namespaces';

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
				[ MessageKeys.EDIT_WARNING_HEADING ]: expectedHeading,
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
				[ MessageKeys.EDIT_WARNING_MESSAGE ]: expectedMessage,
			} ) ],
		} );

		expect( wrapper.find( '.wb-ui-anon-edit-warning__message' ).text() )
			.toBe( expectedMessage );
	} );

	it( 'has a focused login button', () => {
		const buttonLabel = 'login';
		const focus = jest.fn();
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStoreWithLinks(),
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKeys.LOGIN ]: buttonLabel,
			} ) ],
			directives: {
				focus,
			},
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		expect( button.props( 'href' ) ).toBe( LOGIN_URL );
		expect( button.props( 'preventDefault' ) ).toBe( false );
		expect( focus ).toBeCalledTimes( 1 );
	} );

	it( 'has a sign-up button', () => {
		const buttonLabel = 'sign up';
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStoreWithLinks(),
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKeys.CREATE_ACCOUNT ]: buttonLabel,
			} ) ],
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--framelessProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		expect( button.props( 'href' ) ).toBe( SIGNUP_URL );
		expect( button.props( 'preventDefault' ) ).toBe( false );
	} );

	it( 'has a dismiss button', () => {
		const buttonLabel = 'edit w/o login';
		const wrapper = shallowMount( AnonEditWarning, {
			store: createStore(),
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKeys.EDIT_WARNING_DISMISS_BUTTON ]: buttonLabel,
			} ) ],
		} );

		const button = wrapper.find( '.wb-ui-event-emitting-button--normal' );
		expect( button.text() ).toBe( buttonLabel );

		button.trigger( 'click' );
		expect( wrapper.emitted( 'dismiss' ) ).toBeTruthy();
	} );
} );
