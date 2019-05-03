import newConfigMixin from '@/components/mixins/newConfigMixin';
import Vue from 'vue';

describe( 'newConfigMixin', () => {
	it( 'add a config object to Vue intances', () => {
		Vue.mixin( newConfigMixin( { textFieldCharacterLimit: -1 } ) );
		expect( ( new Vue() as any ).config ).toBeDefined();
		expect( ( new Vue() as any ).config.textFieldCharacterLimit ).toBe( -1 );
	} );
} );
