import TermboxServices from '@/common/TermboxServices';
import { Services } from '@/common/TermboxServices';

describe( 'TermboxServices', () => {

	describe.each( [ [
		'languageRepository',
	], [
		'entityRepository',
	], [
		'messagesRepository',
	], [
		'entityEditabilityResolver',
	], [
		'writingEntityRepository',
	], [
		'userPreferenceRepository',
	] ] )( '%s', ( name ) => {
		it( 'throws an error if it is not set', () => {
			expect( () => ( new TermboxServices() ).get( name as keyof Services ) ).toThrow();
		} );

		it( 'can set and get it', () => {
			const services = new TermboxServices();
			const mockService: any = {};
			services.set( name as keyof Services, mockService );
			expect( services.get( name as keyof Services ) ).toBe( mockService );
		} );
	} );
} );
