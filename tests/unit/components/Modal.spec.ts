import { shallowMount } from '@vue/test-utils';
import Modal from '@/components/Modal.vue';

describe( 'Modal', () => {
	it( 'gets content through the default slot', () => {
		const content = 'o hai';
		const wrapper = shallowMount( Modal, {
			slots: {
				default: content,
			},
		} );

		expect( wrapper.find( '.wb-ui-modal__content' ).text() ).toBe( content );
	} );
} );
