import { app, storiesOf } from '@storybook/vue3';
import Modal from '@/components/Modal.vue';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import { MessageKey } from '@/common/MessageKey';
import stubMessagesMixin from '../.storybook/helpers/stubMessagesMixin';
import { createStore } from '@/store';
import newConfigMixin from '@/components/mixins/newConfigMixin';

storiesOf( 'LicenseAgreement', module )
	.addParameters( { component: LicenseAgreement } )
	.add( 'in Modal', () => {
		app.mixin( newConfigMixin( {
			textFieldCharacterLimit: 0,
			licenseAgreementInnerHtml: 'Neque porro quisquam est  <a href="https://www.loremipsum.de/">ligans</a>',
		} ) );

		const messages = {
			[ MessageKey.PUBLISH ]: 'asinus',
			[ MessageKey.CANCEL ]: 'dolor',
			[ MessageKey.LICENSE_HEADER ]: 'adipisici elit',
			[ MessageKey.LICENSE_AGREEMENT_ACCEPT_PERSIST ]: 'Quis aute iure reprehenderit in voluptate velit esse',
		};

		return {
			store: createStore( {
				get: () => ( {} ),
			} ),

			components: {
				LicenseAgreement: stubMessagesMixin( LicenseAgreement, messages ),
				Modal,
			},
			template: '<Modal><LicenseAgreement /></Modal>',
		};
	} );
