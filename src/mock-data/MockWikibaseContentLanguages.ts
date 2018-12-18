import { StringTMap } from '@/datamodel/LanguageTranslations';
import * as languageMap from '@/mock-data/data/en_lang_data.json';

export default class MockupWikibaseContentLanguages {
	public getAllPairs(): StringTMap<string> {
		return languageMap.default;
	}
}
