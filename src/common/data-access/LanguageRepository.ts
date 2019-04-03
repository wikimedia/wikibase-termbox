import LanguageCollection from '@/datamodel/LanguageCollection';

interface LanguageRepository {
	getLanguages(): Promise<LanguageCollection>;
}

export default LanguageRepository;
