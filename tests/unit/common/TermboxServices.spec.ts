import TermboxServices from '@/common/TermboxServices';
import LanguageTranslationRepository from '@/common/data-access/LanguageTranslationRepository';
import EntityRepository from '@/client/data-access/EntityRepository';

function newTermboxServices() {
	return new TermboxServices();
}

function newMockLookup(): LanguageTranslationRepository {
	return {} as LanguageTranslationRepository;
}

function newMockEntityRepository(): EntityRepository {
	return {} as EntityRepository;
}

describe( 'TermboxServices', () => {

	describe( 'languageTranslationRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxServices().getLanguageTranslationRepository() ).toThrow();
		} );

		it( 'can set and get a languageTranslationRepository', () => {
			const services = newTermboxServices();
			const mockLookup = newMockLookup();

			services.setLanguageTranslationRepository( mockLookup );
			expect( services.getLanguageTranslationRepository() ).toBe( mockLookup );
		} );
	} );

	describe( 'entityRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxServices().getEntityRepository() ).toThrow();
		} );

		it( 'can set and get an entityRepository', () => {
			const services = newTermboxServices();
			const mockEntityRepository = newMockEntityRepository();

			services.setEntityRepository( mockEntityRepository );
			expect( services.getEntityRepository() ).toBe( mockEntityRepository );
		} );
	} );

	describe( 'entityEditabilityResolver', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxServices().getEntityEditabilityResolver() ).toThrow();
		} );

		it( 'can set and get an entityEditabilityResolver', () => {
			const services = newTermboxServices();
			const mockEntityEditabilityResolver = {
				isEditable: () => Promise.resolve( true ),
			};

			services.setEntityEditabilityResolver( mockEntityEditabilityResolver );
			expect( services.getEntityEditabilityResolver() ).toBe( mockEntityEditabilityResolver );
		} );
	} );

	describe( 'writingEntityRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxServices().getWritingEntityRepository() ).toThrow();
		} );

		it( 'can set and get a writingEntityRepository', () => {
			const services = newTermboxServices();
			const mockRepository = new ( jest.fn() )();

			services.setWritingEntityRepository( mockRepository );
			expect( services.getWritingEntityRepository() ).toBe( mockRepository );
		} );
	} );

	describe( 'UserPreferenceRepository', () => {
		it( 'throws an error if it is not set', () => {
			expect( () => newTermboxServices().getUserPreferenceRepository() ).toThrow();
		} );

		it( 'can set and get a UserPreferenceRepository', () => {
			const services = newTermboxServices();
			const mockRepository = new ( jest.fn() )();

			services.setUserPreferenceRepository( mockRepository );
			expect( services.getUserPreferenceRepository() ).toBe( mockRepository );
		} );
	} );

} );
