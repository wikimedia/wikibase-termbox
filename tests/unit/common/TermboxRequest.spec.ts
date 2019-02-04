import TermboxRequest from '@/common/TermboxRequest';

describe( 'TermboxRequest', () => {
	it( 'takes arguments in constructor and then exposes them', () => {
		const language = 'de';
		const entity = 'Q5';
		const url = '/link/to/edit/Q23';
		const preferredLanguages = [ 'de', 'en', 'it', 'zh', 'de-sw' ];

		const request = new TermboxRequest(
			language,
			entity,
			url,
			preferredLanguages,
		);
		expect( request.language ).toStrictEqual( language );
		expect( request.entityId ).toStrictEqual( entity );
		expect( request.editLinkUrl ).toStrictEqual( url );
		expect( request.preferredLanguages ).toStrictEqual( preferredLanguages );
	} );
} );
