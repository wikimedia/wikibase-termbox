import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import EntityRepository from '@/common/data-access/EntityRepository';

export default class TermboxFactory {
	private languageTranslationRepository?: LanguageTranslationRepository;
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
