import LanguageTranslations from '@/datamodel/LanguageTranslations';

export default interface LanguageTranslationRepository {

	getLanguagesInLanguage( inLanguage: string ): Promise<LanguageTranslations>;

}
