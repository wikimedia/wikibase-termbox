import newConfigMixin from '@/components/mixins/newConfigMixin';
import { createApp } from 'vue';

describe( 'newConfigMixin', () => {
	it( 'adds a config object to Vue instances', () => {
		const textFieldCharacterLimit = 250;
		const licenseAgreementInnerHtml = 'vip';
		const copyrightVersion = 'wikibase-l';
		const editSubmitButtonLabelPublish = false;

		const app = createApp( {
			template: '<span></span>',
		} );
		app.mixin( newConfigMixin( {
			textFieldCharacterLimit,
			licenseAgreementInnerHtml,
			editSubmitButtonLabelPublish,
			copyrightVersion,
		} ) );
		const instance = app.mount( document.createElement( 'div' ) );

		expect( ( instance as any ).config ).toBeDefined();
		expect( ( instance as any ).config.textFieldCharacterLimit ).toBe( textFieldCharacterLimit );
		expect( ( instance as any ).config.licenseAgreementInnerHtml ).toBe( licenseAgreementInnerHtml );
		expect( ( instance as any ).config.copyrightVersion ).toBe( copyrightVersion );
		expect( ( instance as any ).config.editSubmitButtonLabelPublish ).toBe( editSubmitButtonLabelPublish );
	} );
} );
