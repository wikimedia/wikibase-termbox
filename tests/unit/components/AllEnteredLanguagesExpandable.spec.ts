import { shallowMount } from '@vue/test-utils';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';
import { render } from '@vue/server-test-utils';
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

		const switchButton = wrapper.findComponent( { ref: 'allEnteredLanguagesSwitch' } );
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
		const switchButton = wrapper.findComponent( { ref: 'allEnteredLanguagesSwitch' } );

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

		await wrapper.findComponent( { ref: 'allEnteredLanguagesSwitch' } ).trigger( 'click' );

		const closeButton = wrapper.findComponent( { ref: 'allEnteredLanguagesClose' } );
		expect( closeButton.exists() ).toBeTruthy();
		expect( closeButton.text() ).toBe( buttonText );
	} );

	it( 'collapses and hides close button when close button clicked', async () => {
		// scroll* functions are not defined in JSDOM, need to mock it
		Element.prototype.scrollIntoView = jest.fn();

		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin() ],
		} );

		await wrapper.findComponent( { ref: 'allEnteredLanguagesSwitch' } ).trigger( 'click' );
		await wrapper.findComponent( { ref: 'allEnteredLanguagesClose' } ).trigger( 'click' );

		expect( wrapper.findComponent( AllEnteredLanguages ).exists() ).toBeFalsy();
		expect( wrapper.findComponent( { ref: 'allEnteredLanguagesClose' } ).exists() ).toBeFalsy();
	} );

	it( 'scrolls to switch button and focuses on it when close button clicked', async () => {
		// scroll* functions are not defined in JSDOM, need to mock it
		Element.prototype.scrollIntoView = jest.fn();

		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin() ],
		} );

		const switchButton = wrapper.findComponent( { ref: 'allEnteredLanguagesSwitch' } );
		const switchButtonScrollIntoViewSpy = jest.spyOn( switchButton.element, 'scrollIntoView' );
		await switchButton.trigger( 'click' );

		await wrapper.findComponent( { ref: 'allEnteredLanguagesClose' } ).trigger( 'click' );

		expect( document.activeElement ).toBe( switchButton.element );
		expect( switchButtonScrollIntoViewSpy ).toHaveBeenCalled();
	} );

	it( 'does not expand all entered languages by default', () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);
		expect( wrapper.findComponent( AllEnteredLanguages ).exists() ).toBeFalsy();
	} );

	it( 'is not shown when rendered on the server', () => {
		// it returns a cheerio wrapper, not a string as the d.ts claims
		// https://vue-test-utils.vuejs.org/api/render.html#render
		const wrapper = render(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin( { [ MessageKey.ALL_LANGUAGES ]: 'button text' } ) ] },
		) as any;
		expect( wrapper.text() ).toBe( '' );
	} );

} );
