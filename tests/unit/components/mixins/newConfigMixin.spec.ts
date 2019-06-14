import newConfigMixin from '@/components/mixins/newConfigMixin';
import Vue from 'vue';

describe( 'newConfigMixin', () => {
	it( 'adds a config object to Vue instances', () => {
		const textFieldCharacterLimit = 250;
		const licenseAgreementInnerHtml = 'vip';
		const copyrightVersion = 'wikibase-l';

		Vue.mixin( newConfigMixin( {
			textFieldCharacterLimit,
			licenseAgreementInnerHtml,
			copyrightVersion,
		} ) );
		expect( ( new Vue() as any ).config ).toBeDefined();
		expect( ( new Vue() as any ).config.textFieldCharacterLimit ).toBe( textFieldCharacterLimit );
		expect( ( new Vue() as any ).config.licenseAgreementInnerHtml ).toBe( licenseAgreementInnerHtml );
		expect( ( new Vue() as any ).config.copyrightVersion ).toBe( copyrightVersion );
	} );
} );
