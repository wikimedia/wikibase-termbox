import { renderToString } from '@vue/server-renderer';
import {
	mount,
	shallowMount,
} from '@vue/test-utils';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';
import { createSSRApp } from 'vue';
import mockMessageMixin from '../store/mockMessageMixin';
import { MessageKey } from '@/common/MessageKey';

describe( 'AllEnteredLanguagesExpandable', () => {

	it( 'has a switch button', async () => {
		const buttonTextCollapsed = 'all entered languages';
		const buttonTextExpanded = 'fewer languages';
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin( {
				[ MessageKey.ALL_LANGUAGES ]: buttonTextCollapsed,
				[ MessageKey.FEWER_LANGUAGES ]: buttonTextExpanded,
			} ) ],
		} );
		await wrapper.vm.$nextTick();

		const switchButton = wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' );
		expect( switchButton.exists() ).toBeTruthy();
		expect( switchButton.text() ).toBe( buttonTextCollapsed );

		await switchButton.trigger( 'click' );

		expect( switchButton.exists() ).toBeTruthy();
		expect( switchButton.text() ).toBe( buttonTextExpanded );
	} );

	it( 'expands and collapses all entered languages on consecutive clicks on switch button', async () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);
		await wrapper.vm.$nextTick();
		const switchButton = wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' );

		await switchButton.trigger( 'click' );

		expect( wrapper.findComponent( AllEnteredLanguages ).exists() ).toBeTruthy();

		await switchButton.trigger( 'click' );

		expect( wrapper.findComponent( AllEnteredLanguages ).exists() ).toBeFalsy();
	} );

	it( 'has close button after being expanded', async () => {
		const buttonText = 'fewer languages';
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin( { [ MessageKey.FEWER_LANGUAGES ]: buttonText } ) ],
		} );
		await wrapper.vm.$nextTick();

		await wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' ).trigger( 'click' );

		const closeButton = wrapper.find( '.wb-ui-all-entered-languages-expandable__close' );
		expect( closeButton.exists() ).toBeTruthy();
		expect( closeButton.text() ).toBe( buttonText );
	} );

	it( 'collapses and hides close button when close button clicked', async () => {
		// scroll* functions are not defined in JSDOM, need to mock it
		Element.prototype.scrollIntoView = jest.fn();

		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin() ],
		} );
		await wrapper.vm.$nextTick();

		await wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' ).trigger( 'click' );
		await wrapper.find( '.wb-ui-all-entered-languages-expandable__close' ).trigger( 'click' );

		expect( wrapper.findComponent( AllEnteredLanguages ).exists() ).toBeFalsy();
		expect( wrapper.find( '.wb-ui-all-entered-languages-expandable__close' ).exists() ).toBeFalsy();
	} );

	it( 'scrolls to switch button and focuses on it when close button clicked', async () => {
		// scroll* functions are not defined in JSDOM, need to mock it
		Element.prototype.scrollIntoView = jest.fn();

		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin() ],
		} );
		await wrapper.vm.$nextTick();

		const switchButton = wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' );
		const switchButtonFocusSpy = jest.spyOn( switchButton.element as HTMLElement, 'focus' );
		const switchButtonScrollIntoViewSpy = jest.spyOn( switchButton.element, 'scrollIntoView' );
		await switchButton.trigger( 'click' );

		await wrapper.find( '.wb-ui-all-entered-languages-expandable__close' ).trigger( 'click' );

		expect( switchButtonFocusSpy ).toHaveBeenCalled();
		expect( switchButtonScrollIntoViewSpy ).toHaveBeenCalled();
	} );

	it( 'does not expand all entered languages by default', async () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);
		await wrapper.vm.$nextTick();
		expect( wrapper.findComponent( AllEnteredLanguages ).exists() ).toBeFalsy();
	} );

	it( 'is not shown when rendered on the server', async () => {
		// reset vue-test-utils stubbing (transformVNodeArgs internal API) from other tests
		mount( { render: () => '' } );

		const app = createSSRApp( AllEnteredLanguagesExpandable )
			.mixin( mockMessageMixin( { [ MessageKey.ALL_LANGUAGES ]: 'button text' } ) );
		const html = ( await renderToString( app ) )
			.replace( /<!--.*?-->/g, '' );
		expect( html ).toBe( '' );
	} );

} );
