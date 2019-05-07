import newConfigMixin from '@/components/mixins/newConfigMixin';
import Vue from 'vue';

describe( 'newConfigMixin', () => {
	it( 'adds a config object to Vue instances', () => {
		const textFieldCharacterLimit = 250;

		Vue.mixin( newConfigMixin( {
			textFieldCharacterLimit,
		} ) );
		expect( ( new Vue() as any ).config ).toBeDefined();
		expect( ( new Vue() as any ).config.textFieldCharacterLimit ).toBe( textFieldCharacterLimit );
	} );
} );
