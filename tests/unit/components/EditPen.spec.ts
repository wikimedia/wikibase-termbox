import EditPen from '@/components/EditPen.vue';
import { mount } from '@vue/test-utils';

describe( 'EditPen', () => {

	it( 'creates a link from its href prop', () => {
		const url = '/edit/Q123';
		const wrapper = mount( EditPen, {
			propsData: {
				href: url,
			},
		} );

		expect( wrapper.find( 'a' ).attributes().href ).toBe( url );
	} );

} );
