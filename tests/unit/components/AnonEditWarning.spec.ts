import { shallowMount } from '@vue/test-utils';
import AnonEditWarning from '@/components/AnonEditWarning.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import { MessageKeys } from '@/common/MessageKeys';

describe( 'AnonEditWarning', () => {
	it( 'has a heading', () => {
		const expectedHeading = 'you are not logged in';
		const wrapper = shallowMount( AnonEditWarning, {
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
			mixins: [ mockMessageMixin( {
				[ MessageKeys.EDIT_WARNING_MESSAGE ]: expectedMessage,
			} ) ],
		} );

		expect( wrapper.find( '.wb-ui-anon-edit-warning__message' ).text() )
			.toBe( expectedMessage );
	} );

	it( 'has a login button', () => {
		const buttonLabel = 'login';
		const wrapper = shallowMount( AnonEditWarning, {
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKeys.LOGIN ]: buttonLabel,
			} ) ],
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		// TODO assert URL
	} );

	it( 'has a sign-up button', () => {
		const buttonLabel = 'sign up';
		const wrapper = shallowMount( AnonEditWarning, {
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKeys.CREATE_ACCOUNT ]: buttonLabel,
			} ) ],
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--framelessProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		// TODO assert URL
	} );

	it( 'has a dismiss button', () => {
		const buttonLabel = 'edit w/o login';
		const wrapper = shallowMount( AnonEditWarning, {
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
