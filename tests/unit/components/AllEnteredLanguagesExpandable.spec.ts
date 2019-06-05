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

	it( 'does not expand all entered languages by default', () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);
		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeFalsy();
	} );

	it( 'expands all entered languages on click', () => {
		const wrapper = shallowMount(
			AllEnteredLanguagesExpandable,
			{ mixins: [ mockMessageMixin() ] },
		);
		wrapper.find( '.wb-ui-all-entered-languages-expandable__switch' ).trigger( 'click' );

		expect( wrapper.find( AllEnteredLanguages ).exists() ).toBeTruthy();
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
