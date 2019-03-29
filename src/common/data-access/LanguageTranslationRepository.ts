import LanguageTranslations from '@/datamodel/LanguageTranslations';

interface LanguageTranslationRepository {

	getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations>;

}

export default LanguageTranslationRepository;
