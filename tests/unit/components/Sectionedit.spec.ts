import Sectionedit from '@/components/Sectionedit.vue';
import { shallowMount } from '@vue/test-utils';
import { renderToString } from '@vue/server-renderer';
import { load } from 'cheerio';
import {
	createSSRApp,
	h,
} from 'vue';

describe( 'Sectionedit', () => {

	it( 'wraps in proprietary wikibase tag to show/hide depending on editability on server', async () => {
		const content = 'testing';
		const app = createSSRApp( {
			render() {
				return h( Sectionedit, {}, { default: () => content } );
			},
		} );
		const html = await renderToString( app );
		const wrapper = load( '' )( html );
		const rootElem = Array.prototype.find.call(
			wrapper,
			( node ) => node.type === 'tag',
		);
		const rootElemWrapper = load( '' )( rootElem );

		expect( rootElem.tagName.toLowerCase() )
			.toEqual( 'wb:sectionedit' );
		expect( wrapper.text() ).toBe( content );
		expect( rootElemWrapper.find( 'div' ).length ).toBe( 1 );
	} );

	it( 'changes to "normal" div after mounting on client', async () => {
		const content = 'testing';
		const wrapper = shallowMount( Sectionedit, {
			slots: {
				default: content,
			},
		} );
		// the real element is actually the wrapper’s child due to the HTML comment before it
		const element = () => wrapper.element.firstElementChild as HTMLElement;

		expect( element().tagName.toLowerCase() )
			.toEqual( 'wb:sectionedit' );
		expect( wrapper.text() ).toBe( content );

		await wrapper.vm.$nextTick();

		expect( element().tagName.toLowerCase() )
			.toEqual( 'div' );
		expect( wrapper.text() ).toBe( content );
	} );
} );
