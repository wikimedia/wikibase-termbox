import { mount } from '@vue/test-utils';
import TermTextField from '@/components/TermTextField.vue';

describe( 'TermTextField', () => {

	it( 'is a textarea element', () => {
		const wrapper = mount( TermTextField, {} );
		expect( wrapper.element.nodeName ).toBe( 'TEXTAREA' );
	} );

	it( 'shows its value prop as the textarea value', () => {
		const value = 'hello';
		const wrapper = mount( TermTextField, {
			propsData: {
				value,
			},
		} );

		expect( ( wrapper.element as HTMLTextAreaElement ).value ).toBe( value );
	} );

	it( 'propagates input events to its parent', () => {
		const wrapper = mount( TermTextField );
		const value = 'foo';
		( wrapper.element as HTMLTextAreaElement ).value = value;
		wrapper.trigger( 'input' );
		expect( wrapper.emitted( 'input' )[ 0 ] ).toEqual( [ value ] );
	} );

	// the automatically adjusted height is hard to test in a jsdom environment

} );
