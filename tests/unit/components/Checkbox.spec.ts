import Checkbox from '@/components/Checkbox.vue';
import { shallowMount } from '@vue/test-utils';

function shallowMountWithProps( props = {} ) {
	return shallowMount( Checkbox, {
		propsData: {
			label: 'check me',
			...props,
		},
	} );
}

describe( 'Checkbox', () => {

	it( 'emits by clicking', () => {
		const wrapper = shallowMountWithProps();
		wrapper.find( 'label' ).trigger( 'click' );
		const clickEvent = wrapper.emitted( 'input' );
		expect( clickEvent ).toBeTruthy();
	} );

	it( 'has a label', () => {
		const label = 'click me';
		const wrapper = shallowMountWithProps( { label } );
		expect( wrapper.find( 'label' ).text() ).toBe( label );
	} );

	it( 'connects the checkebox with it\'s label', () => {
		const wrapper = shallowMountWithProps();
		const id = wrapper.find( 'label' ).attributes( 'for' );
		expect( wrapper.find( 'input' ).attributes( 'id' ) ).toBe( id );
	} );

	it( 'can pass down a value', () => {
		const htmlValue = 'test';
		const wrapper = shallowMountWithProps( { htmlValue } );
		expect( wrapper.find( 'input' ).attributes( 'value' ) ).toBe( htmlValue );
	} );
} );
