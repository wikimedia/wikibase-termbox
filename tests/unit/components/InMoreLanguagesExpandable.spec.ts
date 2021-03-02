import InMoreLanguagesExpandable from '@/components/InMoreLanguagesExpandable.vue';
import InMoreLanguages from '@/components/InMoreLanguages.vue';
import { shallowMount } from '@vue/test-utils';
import { createStore } from '@/store';
import { MessageKey } from '@/common/MessageKey';
import { render } from '@vue/server-test-utils';
import mockMessageMixin from '../store/mockMessageMixin';
import emptyServices from '../emptyServices';

describe( 'InMoreLanguagesExpandable', () => {

	it( 'should show the user\'s secondary languages by default', () => {
		const store = createStore( emptyServices as any );
		const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
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
			const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );

			await wrapper.find( '.wb-ui-in-more-languages-expandable__switch' ).trigger( 'click' );

			expect( wrapper.findComponent( InMoreLanguages ).exists() ).toBeFalsy();
		} );
	} );

	describe( 'client/server-specific appearance', () => {

		it( 'has an additional class to appear unclickable when rendered on the server-side', async () => {
			const store = createStore( emptyServices as any );
			const $button = ( await render( InMoreLanguagesExpandable, { store } ) )
				.find( '.wb-ui-in-more-languages-expandable__switch' );
			expect( $button.hasClass( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( true );
		} );

		it( 'has no extra class when mounted on the client side', () => {
			const store = createStore( emptyServices as any );
			const wrapper = shallowMount( InMoreLanguagesExpandable, { store } );
			expect( wrapper.find( '.wb-ui-in-more-languages-expandable__switch' )
				.classes( 'wb-ui-in-more-languages-expandable__switch--unclickable' ) ).toBe( false );
		} );

	} );

} );
