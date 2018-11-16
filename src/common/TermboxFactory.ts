import LanguageRepository from '@/common/data-access/LanguageRepository';

export default class TermboxFactory {
	private languageRepository?: LanguageRepository;

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

}

const instance = new TermboxFactory();

export {
	instance,
};
