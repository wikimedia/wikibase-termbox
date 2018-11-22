import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';

export default interface LanguageState {
	translations: LanguageTranslations;
	languages: LanguageCollection;
}
