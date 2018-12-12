import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import EntityRepository from '@/common/data-access/EntityRepository';
import LanguageRepository from '@/common/data-access/LanguageRepository';

export default class TermboxFactory {
	private languageTranslationRepository?: LanguageTranslationRepository;
	private languageRepository?: LanguageRepository;
	private entityRepository?: EntityRepository;

	public setLanguageTranslationRepository( lookup: LanguageTranslationRepository ) {
		this.languageTranslationRepository = lookup;
	}

	public getLanguageTranslationRepository() {
		if ( this.languageTranslationRepository ) {
			return this.languageTranslationRepository;
		} else {
			throw new Error( 'languageTranslationRepository is undefined' );
		}
	}

	public setLanguageRepository( languageRepository: LanguageRepository ) {
		this.languageRepository = languageRepository;
	}

	public getLanguageRepository() {
		if ( this.languageRepository ) {
			return this.languageRepository;
		} else {
			throw new Error( 'languageRepository is undefined' );
		}
	}

	public setEntityRepository( lookup: EntityRepository ) {
		this.entityRepository = lookup;
	}

	public getEntityRepository() {
		if ( this.entityRepository ) {
			return this.entityRepository;
		} else {
			throw new Error( 'entityRepository is undefined' );
		}
	}

}

const factory = new TermboxFactory();

export {
	factory,
};
