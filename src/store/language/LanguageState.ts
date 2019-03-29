import LanguageTranslations from '@/datamodel/LanguageTranslations';
import LanguageCollection from '@/datamodel/LanguageCollection';

interface LanguageState {
	translations: LanguageTranslations;
	languages: LanguageCollection;
}

export default LanguageState;
