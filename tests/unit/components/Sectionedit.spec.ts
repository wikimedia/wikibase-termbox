import Sectionedit from '@/components/Sectionedit.vue';
import { shallowMount } from '@vue/test-utils';
import { render } from '@vue/server-test-utils';
import 'cheerio';

describe( 'Sectionedit', () => {

	it( 'wraps in proprietary wikibase tag to show/hide depending on editability on server', () => {
		const content = 'testing';
		const wrapper = render( Sectionedit, {
			slots: {
				default: content,
			},
		} ) as unknown as Cheerio; // https://github.com/vuejs/vue-test-utils/issues/1131

		expect( wrapper[ 0 ].tagName.toLowerCase() )
			.toEqual( 'wb:sectionedit' );
		expect( wrapper.find( 'div' ).length ).toBe( 1 );
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
