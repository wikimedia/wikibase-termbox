import TermboxFactory from '@/common/TermboxFactory';
import LanguageRepository from '@/common/data-access/LanguageRepository';

function newTermboxFactory() {
	return new TermboxFactory();
}

function newMockLookup(): LanguageRepository {
	return {} as LanguageRepository;
}

describe( 'TermboxFactory', () => {

	describe( 'languageRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxFactory().getLanguageRepository() ).toThrow();
		} );

		it( 'can set and get a languageRepository', () => {
			const factory = newTermboxFactory();
			const mockLookup = newMockLookup();

			factory.setLanguageRepository( mockLookup );
			expect( factory.getLanguageRepository() ).toBe( mockLookup );
		} );
	} );

} );
