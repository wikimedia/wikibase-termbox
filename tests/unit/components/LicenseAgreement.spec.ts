import { shallowMount } from '@vue/test-utils';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import newConfigMixin from '@/components/mixins/newConfigMixin';
import { MessageKey } from '@/common/MessageKey';

describe( 'LicenseAgreement', () => {

	it( 'has a heading', () => {
		const expectedHeading = 'you are not logged in';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin( {
				[ MessageKey.LICENSE_HEADER ]: expectedHeading,
			} ) ],
		} );

		expect( wrapper.find( '.wb-ui-license-agreement__heading' ).text() )
			.toBe( expectedHeading );
	} );

	it( 'has a message, which can contain html', () => {
		const expectedMessage = 'Accept our agreement. <a href="#">See here</a> [...]';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [
				newConfigMixin( {
					textFieldCharacterLimit: 0,
					licenseAgreementInnerHtml: expectedMessage,
				} ),
				mockMessageMixin( {
					[ MessageKey.LICENSE_HEADER ]: 'abc',
				} ),
			],
		} );

		expect( wrapper.find( '.wb-ui-license-agreement__message' ).element.innerHTML ).toBe( expectedMessage );
		expect( wrapper.find( '.wb-ui-license-agreement__message>a' ).exists() ).toBeTruthy();
	} );

	it( 'has a publish button which emits save', () => {
		const buttonLabel = 'publish';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [
				mockMessageMixin( {
					[ MessageKey.LICENSE_HEADER ]: '',
					[ MessageKey.PUBLISH ]: buttonLabel,
				} ),
			],
		} );
		const button = wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' );

		expect( button.text() ).toBe( buttonLabel );
		button.trigger( 'click' );
		expect( wrapper.emitted( 'save' ) ).toBeTruthy();
	} );

	it( 'has a cancel button which emits cancel', () => {
		const buttonLabel = 'cancel';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [
				mockMessageMixin( {
					[ MessageKey.LICENSE_HEADER ]: '',
					[ MessageKey.CANCEL ]: buttonLabel,
				} ),
			],
		} );

		const button = wrapper.find( '.wb-ui-event-emitting-button--normal' );

		expect( button.text() ).toBe( buttonLabel );
		button.trigger( 'click' );
		expect( wrapper.emitted( 'cancel' ) ).toBeTruthy();
	} );
} );
