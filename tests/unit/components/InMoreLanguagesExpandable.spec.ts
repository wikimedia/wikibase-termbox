import { MessageKey } from '@/common/MessageKey';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import { createStore } from '@/store';
import { renderToString } from '@vue/server-renderer';
import {
	mount,
	shallowMount,
} from '@vue/test-utils';
import { load } from 'cheerio';
import { createSSRApp } from 'vue';
import emptyServices from '../emptyServices';
import mockMessageMixin from '../store/mockMessageMixin';

describe( 'InMoreLanguagesExpandable', () => {

	it( 'should show the user\'s secondary languages by default', () => {
		const store = createStore( emptyServices as any );
		const wrapper = shallowMount( InMoreLanguagesExpandable, { global: { plugins: [ store ] } } );
		expect( wrapper.findComponent( InMoreLanguages ).exists() ).toBeTruthy();
	} );

	describe( 'toggle button', () => {
		it( 'has a button saying "in more languages"', () => {
			const expectedLinkText = 'moar languages';
			const wrapper = shallowMount( InMoreLanguagesExpandable, {
				mixins: [ mockMessageMixin( { [ MessageKey.IN_MORE_LANGUAGES ]: expectedLinkText } ) ],
			} );

			expect( wrapper.find( '.wb-ui-in-more-languages-expandable__switch span' ).text() )
				.toBe( expectedLinkText );
		} );

		it( 'toggle collapses/expands the user\'s secondary languages on click', async () => {
			const store = createStore( emptyServices as any );
			const wrapper = shallowMount( InMoreLanguagesExpandable, { global: { plugins: [ store ] } } );

			await wrapper.find( '.wb-ui-in-more-languages-expandable__switch' ).trigger( 'click' );

			expect( wrapper.findComponent( InMoreLanguages ).exists() ).toBeFalsy();
		} );
	} );

	describe( 'client/server-specific appearance', () => {

		it( 'has an additional class to appear unclickable when rendered on the server-side', async () => {
			// reset vue-test-utils stubbing (transformVNodeArgs internal API) from other tests
			mount( { render: () => '' } );

			const store = createStore( emptyServices as any );
			const app = createSSRApp( InMoreLanguagesExpandable )
				.use( store );
			const $button = load( '' )( await renderToString( app ) )
				.find( '.wb-ui-in-more-languages-expandable__switch' );
			expect( $button.hasClass( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( true );
		} );

		it( 'removes extra class after mounting on the client side', async () => {
			const store = createStore( emptyServices as any );
			const wrapper = shallowMount( InMoreLanguagesExpandable, { global: { plugins: [ store ] } } );
			expect( wrapper.find( '.wb-ui-in-more-languages-expandable__switch' )
				.classes( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( true );
			await wrapper.vm.$nextTick();
			expect( wrapper.find( '.wb-ui-in-more-languages-expandable__switch' )
				.classes( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( false );
		} );

	} );

} );
