import TermboxRequest from '@/common/TermboxRequest';

describe( 'TermboxRequest', () => {
	it( 'takes arguments in constructor and then exposes them', () => {
		const language = 'de';
		const entity = 'Q5';

		const request = new TermboxRequest( language, entity );
		expect( request.language ).toEqual( language );
		expect( request.entityId ).toEqual( entity );
	} );
} );
