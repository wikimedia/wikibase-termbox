import inlanguage from '@/directives/inlanguage';
import Language from '@/datamodel/Language';
import { NS_LANGUAGE } from '@/store/namespaces';
import hotUpdateDeep from '@wmde/vuex-helpers/dist/hotUpdateDeep';
import emptyServices from '../emptyServices';
import { createStore } from '@/store';
import Label from '@/components/Label.vue';
import { mount } from '@vue/test-utils';

describe( 'inlanguage directive', () => {
	it( 'adds language properties to element\'s attributes', () => {
		const languageCode = 'de';
		const language: Language = { code: languageCode, directionality: 'ltr' };
		const element = document.createElement( 'div' );
		element.setAttribute = jest.fn();

		const getLanguageByCode = jest.fn().mockReturnValue( language );
		const store = hotUpdateDeep( createStore( emptyServices as any ), {
			modules: {
				[ NS_LANGUAGE ]: {
					getters: {
						getByCode: () => getLanguageByCode,
					},
				},
			},
		} );

		const wrapper = mount( Label, { global: { plugins: [ store ] } } ).vm;
		inlanguage(
			element,
			{
				modifiers: {},
				value: languageCode,
				oldValue: '',
				instance: wrapper,
				dir: {},
			},
		);

		expect( getLanguageByCode ).toHaveBeenCalledWith( languageCode );
		expect( element.setAttribute ).toHaveBeenCalledWith( 'lang', language.code );
		expect( element.setAttribute ).toHaveBeenCalledWith( 'dir', language.directionality );
	} );
} );
