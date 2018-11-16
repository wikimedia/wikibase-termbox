export default interface LanguageRepository {

	getLanguageName( languageCode: string, inLanguage: string ): Promise<string>;

}
