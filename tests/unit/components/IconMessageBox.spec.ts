import IconMessageBox from '@/components/IconMessageBox.vue';
import { shallowMount } from '@vue/test-utils';

describe( 'IconMessageBox', () => {
	it( 'gets content through the default slot', () => {
		const message = 'some message';
		const wrapper = shallowMount( IconMessageBox, {
			slots: { default: message },
			propsData: { type: 'warning' },
		} );

		expect( wrapper.text() ).toBe( message );
	} );

	it( 'sets its class based on its `type` prop', () => {
		const wrapper = shallowMount( IconMessageBox, {
			propsData: { type: 'error' },
		} );
		expect( wrapper.classes() ).toContain( 'wb-ui-icon-message-box--error' );
	} );

	it( 'throws for unknown type', () => {
		expect( () => shallowMount( IconMessageBox, {
			propsData: { type: 'potato' },
		} ) ).toThrow();
	} );
} );
