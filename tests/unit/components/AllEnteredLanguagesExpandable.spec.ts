import { shallowMount } from '@vue/test-utils';
import AllEnteredLanguagesExpandable from '@/components/AllEnteredLanguagesExpandable.vue';
import AllEnteredLanguages from '@/components/AllEnteredLanguages.vue';
import { render } from '@vue/server-test-utils';
import mockMessageMixin from '../store/mockMessageMixin';
import { MessageKey } from '@/common/MessageKey';

describe( 'AllEnteredLanguagesExpandable', () => {

	it( 'has a toggle button', () => {
		const buttonText = 'all entered languages';
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin( { [ MessageKey.ALL_LANGUAGES ]: buttonText } ) ],
		} );

		const button = wrapper.find( '.wb-ui-all-entered-languages-expandable__switch > span' );
		expect( button.exists() ).toBeTruthy();
		expect( button.text() ).toBe( buttonText );
	} );

	it( 'has two toggle buttons after being expanded', () => {
		const buttonText = 'fewer languages';
		const wrapper = shallowMount( AllEnteredLanguagesExpandable, {
			mixins: [ mockMessageMixin( { [ MessageKey.FEWER_LANGUAGES ]: buttonText } ) ],
		} );

		wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' ).trigger( 'click' );

		const buttons = wrapper.findAll( '.wb-ui-all-entered-languages-expandable__switch > span' );
		expect( buttons.length ).toBe( 2 );
		expect( buttons.at( 0 ).text() ).toBe( buttonText );
		expect( buttons.at( 1 ).text() ).toBe( buttonText );
	} );

	it( 'does not expand all entered languages by default', () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);
		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeFalsy();
	} );

	it( 'expands and collapses all entered languages on consecutive clicks', () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);

		wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' ).trigger( 'click' );

		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeTruthy();

		wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' ).trigger( 'click' );

		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeFalsy();
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
