import Checkbox from '@/components/Checkbox.vue';
import { shallowMount } from '@vue/test-utils';

function shallowMountWithProps( props = {} ) {
	return shallowMount( Checkbox, {
		props: {
			value: false,
			label: 'check me',
			...props,
		},
	} );
}

describe( 'Checkbox', () => {

	it( 'emits an input event when the checked state changes', () => {
		const wrapper = shallowMountWithProps();
		wrapper.find( 'input' ).setChecked( true );
		expect( wrapper.emitted( 'input' ) ).toBeTruthy();
	} );

	it( 'has a label', () => {
		const label = 'click me';
		const wrapper = shallowMountWithProps( { label } );
		expect( wrapper.find( 'label' ).text() ).toBe( label );
	} );

	it( 'connects the checkbox with its label', () => {
		const wrapper = shallowMountWithProps();
		const id = wrapper.find( 'label' ).attributes( 'for' );
		expect( wrapper.find( 'input' ).attributes( 'id' ) ).toBe( id );
	} );

	it( 'sets the value attribute of the checkbox element from the `htmlValue` prop', () => {
		const htmlValue = 'test';
		const wrapper = shallowMountWithProps( { htmlValue } );
		expect( wrapper.find( 'input' ).attributes( 'value' ) ).toBe( htmlValue );
	} );

	it( 'sets the checkbox state from the `value` prop', () => {
		const value = true;
		const wrapper = shallowMountWithProps( { value } );
		expect( ( wrapper.find( 'input' ).element as HTMLInputElement ).checked ).toBe( value );
	} );
} );
