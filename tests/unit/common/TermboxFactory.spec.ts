import TermboxFactory from '@/common/TermboxFactory';
import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import EntityRepository from '@/client/data-access/EntityRepository';

function newTermboxFactory() {
	return new TermboxFactory();
}

function newMockLookup(): LanguageTranslationRepository {
	return {} as LanguageTranslationRepository;
}

function newMockEntityRepository(): EntityRepository {
	return {} as EntityRepository;
}

describe( 'TermboxFactory', () => {

	describe( 'languageTranslationRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxFactory().getLanguageTranslationRepository() ).toThrow();
		} );

		it( 'can set and get a languageTranslationRepository', () => {
			const factory = newTermboxFactory();
			const mockLookup = newMockLookup();

			factory.setLanguageTranslationRepository( mockLookup );
			expect( factory.getLanguageTranslationRepository() ).toBe( mockLookup );
		} );
	} );

	describe( 'entityRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxFactory().getEntityRepository() ).toThrow();
		} );

		it( 'can set and get an entityRepository', () => {
			const factory = newTermboxFactory();
			const mockEntityRepository = newMockEntityRepository();

			factory.setEntityRepository( mockEntityRepository );
			expect( factory.getEntityRepository() ).toBe( mockEntityRepository );
		} );
	} );

} );
