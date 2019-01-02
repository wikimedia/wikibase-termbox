import Sectionedit from '@/components/Sectionedit.vue';
import { shallowMount } from '@vue/test-utils';

describe( 'Sectionedit', () => {

	it( 'wraps in proprietary wikibase tag to show/hide depending on editability on server', () => {
		const content = 'testing';
		const wrapper = shallowMount( Sectionedit, {
			slots: {
				default: content,
			},
			propsData: {
				// TODO how to test $isServer?
				// `@jest-environment node` don't work (https://github.com/vuejs/vue-test-utils/issues/427)
				forceServer: true,
			},
		} );

		expect( wrapper.element.getRootNode().nodeName.toLowerCase() )
			.toEqual( 'wb:sectionedit' );
		expect( wrapper.findAll( 'div' ).length ).toBe( 1 );
		expect( wrapper.text() ).toBe( content );
	} );

	it( 'wrapps in "normal" div only on client', () => {
		const content = 'testing';
		const wrapper = shallowMount( Sectionedit, {
			slots: {
				default: content,
			},
		} );

		expect( wrapper.element.getRootNode().nodeName.toLowerCase() )
			.toEqual( 'div' );
		expect( wrapper.text() ).toBe( content );
	} );
} );
