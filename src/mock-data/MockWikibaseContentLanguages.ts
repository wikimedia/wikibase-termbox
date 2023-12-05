import { StringTMap } from '@/datamodel/LanguageTranslations';
import languageMap from '@/mock-data/data/en_lang_data.json';

export default class MockWikibaseContentLanguages {
	public getAll(): string[] {
		return Object.keys( languageMap );
	}

	public getLanguageNameMap(): StringTMap<string> {
		return languageMap;
	}
}
