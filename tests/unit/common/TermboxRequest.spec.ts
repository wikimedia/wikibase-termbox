import TermboxRequest from '@/common/TermboxRequest';

describe( 'TermboxRequest', () => {
	it( 'takes arguments in constructor and then exposes them', () => {
		const language = 'de';
		const entity = 'Q5';
		const url = '/link/to/edit/Q23';

		const request = new TermboxRequest( language, entity, url );
		expect( request.language ).toEqual( language );
		expect( request.entityId ).toEqual( entity );
		expect( request.editLinkUrl ).toEqual( url );
	} );
} );
