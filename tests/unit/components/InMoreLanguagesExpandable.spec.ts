import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { MessageKey } from '@/common/MessageKey';
import { render } from '@vue/server-test-utils';
import mockMessageMixin from '../store/mockMessageMixin';

describe( 'InMoreLanguagesExpandable', () => {

	it( 'should show the user\'s secondary languages by default', () => {
		const store = createStore();
		const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
		expect( wrapper.find( InMoreLanguages ).exists() ).toBeTruthy();
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

		it( 'toggle collapses/expands the user\'s secondary languages on click', () => {
			const store = createStore();
			const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
			wrapper.find( '.wb-ui-in-more-languages-expandable__switch' ).trigger( 'click' );

			expect( wrapper.find( InMoreLanguages ).exists() ).toBeFalsy();
		} );
	} );

	describe( 'client/server-specific appearance', () => {

		it( 'has an additional class to appear unclickable when rendered on the server-side', () => {
			const store = createStore();
			// render returns a cheerio wrapper, not a string as the d.ts claims
			// https://vue-test-utils.vuejs.org/api/render.html#render
			const $button = ( render( InMoreLanguagesExpandable, { store } ) as any )
				.find( '.wb-ui-in-more-languages-expandable__switch' );
			expect( $button.hasClass( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( true );
		} );

		it( 'has no extra class when mounted on the client side', () => {
			const store = createStore();
			const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
			expect( wrapper.find( '.wb-ui-in-more-languages-expandable__switch' )
				.classes( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( false );
		} );

	} );

} );
