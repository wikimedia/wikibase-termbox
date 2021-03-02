import Vue from 'vue';
import '@/client/directives';
import newConfigMixin from '@/components/mixins/newConfigMixin';

beforeEach( () => {
	expect.hasAssertions();
} );

Vue.mixin( newConfigMixin( {
	textFieldCharacterLimit: 0,
	licenseAgreementInnerHtml: '',
	copyrightVersion: '',
} ) );
