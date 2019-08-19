import { storiesOf } from '@storybook/vue';
import Modal from '@/components/Modal.vue';
import LicenseAgreement from '@/components/LicenseAgreement.vue';
import { MessageKey } from '@/common/MessageKey';
import stubMessagesMixin from '../.storybook/helpers/stubMessagesMixin';
import { createStore } from '@/store';
import Vue from 'vue';
import newConfigMixin from '@/components/mixins/newConfigMixin';

Vue.mixin( newConfigMixin( {
	textFieldCharacterLimit: 0,
	licenseAgreementInnerHtml: 'Neque porro quisquam est  <a href="https://www.loremipsum.de/">ligans</a>',
} ) );

storiesOf( 'LicenseAgreement', module )
	.add( 'in Modal', () => {
		const messages = {
			[ MessageKey.PUBLISH ]: 'asinus',
			[ MessageKey.CANCEL ]: 'dolor',
			[ MessageKey.LICENSE_HEADER ]: 'adipisici elit',
			[ MessageKey.LICENSE_AGREEMENT_ACCEPT_PERSIST ]: 'Quis aute iure reprehenderit in voluptate velit esse',
		};

		return {
			store: createStore(),

			components: {
				LicenseAgreement: stubMessagesMixin( LicenseAgreement, messages ),
				Modal,
			},
			template: '<Modal><LicenseAgreement /></Modal>',
		};
	}, {
		info: {
			components: { LicenseAgreement },
		},
	} );
