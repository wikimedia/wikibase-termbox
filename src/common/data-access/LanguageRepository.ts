import LanguageCollection from '@/datamodel/LanguageCollection';

export default interface LanguageRepository {
	getLanguages(): Promise<LanguageCollection>;
}
