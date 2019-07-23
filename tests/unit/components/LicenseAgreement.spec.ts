import { shallowMount } from '@vue/test-utils';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import Checkbox from '@/components/Checkbox.vue';
import IconMessageBox from '@/components/IconMessageBox.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import newConfigMixin from '@/components/mixins/newConfigMixin';
import { MessageKey } from '@/common/MessageKey';
import createMockableStore from '../store/createMockableStore';
import { NS_USER } from '@/store/namespaces';
import { USER_PREFERENCE_SET } from '@/store/user/actionTypes';
import { UserPreference } from '@/common/UserPreference';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';

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
		const expectedMessage = 'Accept our agreement. <strong>See here</strong> [...]';
		const wrapper = shallowMount( LicenseAgreement, {
			mixins: [
				newConfigMixin( {
					licenseAgreementInnerHtml: expectedMessage,
				} as ConfigOptions ),
				mockMessageMixin( {
					[ MessageKey.LICENSE_HEADER ]: 'abc',
				} ),
			],
		} );

		expect( wrapper.find( IconMessageBox ).props( 'type' ) ).toBe( 'warning' );
		expect( wrapper.find( IconMessageBox ).element.innerHTML ).toBe( expectedMessage );
		expect( wrapper.find( IconMessageBox ).find( 'strong' ).exists() ).toBeTruthy();
	} );

	it( 'ensures links open in a new tab', () => {
		const wrapper = shallowMount( LicenseAgreement, {
			mixins: [
				newConfigMixin( {
					licenseAgreementInnerHtml: `Please agree to our
						<a href="https://creativecommons.org/" rel="nofollow">terms of use</a>`,
				} as ConfigOptions ),
				mockMessageMixin( {} ),
			],
		} );

		const link = wrapper.find( '.wb-ui-license-agreement__message > a' );
		expect( link.attributes( 'target' ) ).toBe( '_blank' );
		expect( link.attributes( 'rel' ) ).toBe( 'nofollow noopener noreferrer' );
	} );

	it( 'has a publish button which emits save', () => {
		const buttonLabel = 'publish';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			store: createMockableStore( {
				modules: {
					[ NS_USER ]: {
						actions: { [ USER_PREFERENCE_SET ]: jest.fn() },
					},
				},
			} ),
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

	it( 'has a checkbox that is checked by default', () => {
		const label = 'remember my choice';
		const wrapper = shallowMount( LicenseAgreement, {
			mixins: [ mockMessageMixin( { [ MessageKey.LICENSE_AGREEMENT_ACCEPT_PERSIST ]: label } ) ],
		} );

		const checkbox = wrapper.find( Checkbox );
		expect( checkbox.exists() ).toBeTruthy();
		expect( checkbox.props( 'label' ) ).toBe( label );
		expect( checkbox.props( 'value' ) ).toBe( true );
	} );

	it( 'sets a preference if the checkbox is checked when clicking publish', () => {
		const mockSetPreference = jest.fn();
		const copyrightVersion = 'wikibase-1';
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [
				mockMessageMixin(),
				newConfigMixin( { copyrightVersion } as ConfigOptions ),
			],
			store: createMockableStore( {
				modules: {
					[ NS_USER ]: {
						actions: { [ USER_PREFERENCE_SET ]: mockSetPreference },
					},
				},
			} ),
		} );

		wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' ).trigger( 'click' );

		expect( mockSetPreference ).toHaveBeenCalledWith( expect.anything(), {
			name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
			value: copyrightVersion,
		}, undefined );
	} );

	it( 'unsets the "remember my choice" preference when unchecking the checkbox and clicking publish', () => {
		const mockSetPreference = jest.fn();
		const wrapper = shallowMount( LicenseAgreement, {
			stubs: { EventEmittingButton },
			mixins: [ mockMessageMixin() ],
			store: createMockableStore( {
				modules: {
					[ NS_USER ]: {
						actions: { [ USER_PREFERENCE_SET ]: mockSetPreference },
					},
				},
			} ),
		} );

		wrapper.find( Checkbox ).vm.$emit( 'input', false );
		wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' ).trigger( 'click' );

		expect( mockSetPreference ).toHaveBeenCalledWith( expect.anything(), {
			name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
			value: null,
		}, undefined );
	} );
} );
