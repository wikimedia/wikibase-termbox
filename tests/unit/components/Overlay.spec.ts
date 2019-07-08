import { shallowMount } from '@vue/test-utils';
import Overlay from '@/components/Overlay.vue';

describe( 'Overlay', () => {
	it( 'gets content through the default slot', () => {
		const content = 'o hai';
		const wrapper = shallowMount( Overlay, {
			slots: {
				default: content,
			},
		} );

		expect( wrapper.find( '.wb-ui-overlay' ).text() ).toBe( content );
	} );
} );
