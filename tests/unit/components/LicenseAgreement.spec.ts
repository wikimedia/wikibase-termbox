import { shallowMount } from '@vue/test-utils';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import EventEmittingButton from '@/components/EventEmittingButton.vue';
import Checkbox from '@/components/Checkbox.vue';
import IconMessageBox from '@/components/IconMessageBox.vue';
import mockMessageMixin from '../store/mockMessageMixin';
import newConfigMixin from '@/components/mixins/newConfigMixin';
import { MessageKey } from '@/common/MessageKey';
import hotUpdateDeep from '@wmde/vuex-helpers/dist/hotUpdateDeep';
import { NS_USER } from '@/store/namespaces';
import { USER_PREFERENCE_SET } from '@/store/user/actionTypes';
import { UserPreference } from '@/common/UserPreference';
import { ConfigOptions } from '@/components/mixins/newConfigMixin';
import { createStore } from '@/store';
import emptyServices from '../emptyServices';

describe( 'LicenseAgreement', () => {

	// default mixins for tests that need nothing more specific
	const messages = mockMessageMixin();
	const config = newConfigMixin( {} as ConfigOptions );
	const mixins = [ messages, config ];

	it( 'has a heading', () => {
		const expectedHeading = 'you are not logged in';
		const wrapper = shallowMount( LicenseAgreement, {
			global: { stubs: { EventEmittingButton } },
			mixins: [ mockMessageMixin( {
				[ MessageKey.LICENSE_HEADER ]: expectedHeading,
			} ), config ],
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

		expect( wrapper.findComponent( IconMessageBox ).props( 'type' ) ).toBe( 'warning' );
		expect( wrapper.findComponent( IconMessageBox ).element.innerHTML ).toBe( expectedMessage );
		expect( wrapper.findComponent( IconMessageBox ).find( 'strong' ).exists() ).toBeTruthy();
	} );

	it( 'ensures links open in a new tab', () => {
		const wrapper = shallowMount( LicenseAgreement, {
			mixins: [
				newConfigMixin( {
					licenseAgreementInnerHtml: `Please agree to our
						<a href="https://creativecommons.org/" rel="nofollow">terms of use</a>`,
				} as ConfigOptions ),
				messages,
			],
		} );

		const link = wrapper.find( '.wb-ui-license-agreement__message > a' );
		expect( link.attributes( 'target' ) ).toBe( '_blank' );
		expect( link.attributes( 'rel' ) ).toBe( 'nofollow noopener noreferrer' );
	} );

	it( 'has a publish button which emits save', () => {
		const buttonLabel = 'publish';
		const wrapper = shallowMount( LicenseAgreement, {
			global: {
				plugins: [ hotUpdateDeep( createStore( emptyServices as any ), {
					modules: {
						[ NS_USER ]: {
							actions: { [ USER_PREFERENCE_SET ]: jest.fn() },
						},
					},
				} ) ],
				stubs: { EventEmittingButton },
			},
			mixins: [
				mockMessageMixin( {
					[ MessageKey.LICENSE_HEADER ]: '',
					[ MessageKey.PUBLISH ]: buttonLabel,
				} ),
				config,
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
			global: { stubs: { EventEmittingButton } },
			mixins: [
				mockMessageMixin( {
					[ MessageKey.LICENSE_HEADER ]: '',
					[ MessageKey.CANCEL ]: buttonLabel,
				} ),
				config,
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
			mixins: [
				mockMessageMixin( { [ MessageKey.LICENSE_AGREEMENT_ACCEPT_PERSIST ]: label } ),
				config,
			],
		} );

		const checkbox = wrapper.findComponent( Checkbox );
		expect( checkbox.exists() ).toBeTruthy();
		expect( checkbox.props( 'label' ) ).toBe( label );
		expect( checkbox.props( 'value' ) ).toBe( true );
	} );

	it( 'sets a preference if the checkbox is checked when clicking publish', () => {
		const mockSetPreference = jest.fn();
		const copyrightVersion = 'wikibase-1';
		const wrapper = shallowMount( LicenseAgreement, {
			mixins: [
				messages,
				newConfigMixin( { copyrightVersion } as ConfigOptions ),
			],
			global: {
				plugins: [ hotUpdateDeep( createStore( emptyServices as any ), {
					modules: {
						[ NS_USER ]: {
							actions: { [ USER_PREFERENCE_SET ]: mockSetPreference },
						},
					},
				} ) ],
				stubs: { EventEmittingButton },
			},
		} );

		wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' ).trigger( 'click' );

		expect( mockSetPreference ).toHaveBeenCalledWith( expect.anything(), {
			name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
			value: copyrightVersion,
		} );
	} );

	it( 'unsets the "remember my choice" preference when unchecking the checkbox and clicking publish', () => {
		const mockSetPreference = jest.fn();
		const wrapper = shallowMount( LicenseAgreement, {
			mixins,
			global: {
				plugins: [ hotUpdateDeep( createStore( emptyServices as any ), {
					modules: {
						[ NS_USER ]: {
							actions: { [ USER_PREFERENCE_SET ]: mockSetPreference },
						},
					},
				} ) ],
				stubs: { EventEmittingButton },
			},
		} );

		wrapper.findComponent( Checkbox ).vm.$emit( 'input', false );
		wrapper.find( '.wb-ui-event-emitting-button--primaryProgressive' ).trigger( 'click' );

		expect( mockSetPreference ).toHaveBeenCalledWith( expect.anything(), {
			name: UserPreference.ACKNOWLEDGED_COPYRIGHT_VERSION,
			value: null,
		} );
	} );
} );
