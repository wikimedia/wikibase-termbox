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
	] ] )( '%s', ( name: keyof Services ) => {
		it( 'throws an error if it is not set', () => {
			expect( () => ( new TermboxServices() ).get( name ) ).toThrow();
		} );

		it( 'can set and get it', () => {
			const services = new TermboxServices();
			const mockService: any = {};
			services.set( name, mockService );
			expect( services.get( name ) ).toBe( mockService );
		} );
	} );
} );
