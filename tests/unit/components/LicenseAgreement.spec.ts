import { shallowMount } from '@vue/test-utils';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import newConfigMixin from '@/components/mixins/newConfigMixin';
import { MessageKey } from '@/common/MessageKey';

describe( 'LicenseAgreement', () => {

	it( 'has a message, which can contain html', () => {
		const expectedMessage = 'Accept our agreement. <a href="#">See here</a> [...]';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [
				newConfigMixin( {
					textFieldCharacterLimit: 0,
					licenseAgreementInnerHtml: expectedMessage,
				} ),
				mockMessageMixin( {} ),
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
