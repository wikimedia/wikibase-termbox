import { StringTMap } from '@/datamodel/LanguageTranslations';
import languageMap from '@/mock-data/data/en_lang_data.json';

export default class MockWikibaseContentLanguages {
	public getLanguageNameMap(): StringTMap<string> {
		return languageMap;
	}
}
