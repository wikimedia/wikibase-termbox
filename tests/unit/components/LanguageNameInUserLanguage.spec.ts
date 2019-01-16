import { shallowMount } from '@vue/test-utils';
import Language from '@/datamodel/Language';
import LanguageNameInUserLanguage from '@/components/LanguageNameInUserLanguage.vue';
import { createStore } from '@/store';
import { mutation } from '@/store/util';
import {
	NS_USER,
	NS_LANGUAGE,
} from '@/store/namespaces';
import { LANGUAGE_TRANSLATION_UPDATE, LANGUAGE_UPDATE } from '@/store/language/mutationTypes';
import { LANGUAGE_INIT } from '@/store/user/mutationTypes';

describe( 'LanguageNameInUserLanguage', () => {
	const languageAr: Language = {
		code: 'ar',
		directionality: 'rtl',
	};
	const languageDe: Language = {
		code: 'de',
		directionality: 'ltr',
	};
	const userLanguage = languageDe;
	const languageWithUntranslatedName: Language = {
		code: 'en',
		directionality: 'ltr',
	};

	const languageNameDeInDe = 'Deutsch';

	const store = createStore();

	store.commit( mutation( NS_USER, LANGUAGE_INIT ), userLanguage.code );

	store.commit(
		mutation( NS_LANGUAGE, LANGUAGE_TRANSLATION_UPDATE ),
		{
			ar: {
				ar: 'العربية',
				de: 'الألمانية',
				en: 'الإنجليزية',
			},
			de: {
				ar: 'Arabisch',
				de: languageNameDeInDe,
				// en: 'Englisch', // intentionally missing, see '????' test below
			},
			en: {
				ar: 'Arabic',
				de: 'German',
				en: 'English',
			},
		},
	);

	store.commit(
		mutation( NS_LANGUAGE, LANGUAGE_UPDATE ),
		{
			ar: languageAr,
			de: languageDe,
			en: languageWithUntranslatedName,
		},
	);

	it( 'renders language name translation in user language', () => {
		const wrapper = shallowMount( LanguageNameInUserLanguage, {
			store,
			propsData: {
				language: languageDe,
			},
		} );

		expect( wrapper.text() ).toBe( languageNameDeInDe );
	} );

	/**
	 * This requires an inconsistent store to happen (language exists but no translation for it)
	 */
	it( 'renders ???? in case of missing language name translation in user language', () => {
		const wrapper = shallowMount( LanguageNameInUserLanguage, {
			store,
			propsData: {
				language: languageWithUntranslatedName,
			},
		} );
		expect( wrapper.text() ).toBe( '????' );
	} );

	it( 'marks-up the language translations with the user language directionality', () => {
		const wrapper = shallowMount( LanguageNameInUserLanguage, {
			store,
			propsData: { language: languageAr },
		} );
		expect( wrapper.attributes( 'dir' ) )
			.toBe( userLanguage.directionality );
	} );

	it( 'marks-up the language translations with the user language code', () => {
		const wrapper = shallowMount( LanguageNameInUserLanguage, {
			store,
			propsData: { language: languageAr },
		} );
		expect( wrapper.attributes( 'lang' ) )
			.toBe( userLanguage.code );
	} );
} );
