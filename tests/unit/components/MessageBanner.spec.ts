import { shallowMount } from '@vue/test-utils';
import MessageBanner from '@/components/MessageBanner.vue';

describe( 'MessageBanner', () => {
	it( 'gets content through the heading and message slots', () => {
		window.scrollBy = jest.fn();
		const heading = 'some heading';
		const message = 'some message';
		const wrapper = shallowMount( MessageBanner, {
			slots: {
				heading,
				message,
			},
		} );

		expect( wrapper.find( '.wb-ui-message-banner h4' ).text() ).toBe( heading );
		expect( wrapper.find( '.wb-ui-message-banner__message' ).text() ).toBe( message );
	} );
} );
