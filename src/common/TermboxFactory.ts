import LanguageRepository from '@/common/data-access/LanguageRepository';
import EntityRepository from '@/common/data-access/EntityRepository';

export default class TermboxFactory {
	private languageRepository?: LanguageRepository;
	private entityRepository?: EntityRepository;

	public setLanguageRepository( lookup: LanguageRepository ) {
		this.languageRepository = lookup;
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
