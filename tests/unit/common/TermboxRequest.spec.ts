import TermboxRequest from '@/common/TermboxRequest';
import TermboxLinks from '@/common/TermboxLinks';

describe( 'TermboxRequest', () => {
	it( 'takes arguments in constructor and then exposes them', () => {
		const language = 'de';
		const entity = 'Q5';
		const revision = 31510;
		const links: TermboxLinks = {
			editLinkUrl: '/link/to/edit/Q23',
			loginLinkUrl: '/login',
			signUpLinkUrl: '/signUp',
		};
		const preferredLanguages = [ 'de', 'en', 'it', 'zh', 'de-sw' ];
		const user = 'Lord Voldemort';

		const request = new TermboxRequest(
			language,
			entity,
			revision,
			links,
			preferredLanguages,
			user,
		);
		expect( request.language ).toStrictEqual( language );
		expect( request.entityId ).toStrictEqual( entity );
		expect( request.revision ).toStrictEqual( revision );
		expect( request.links ).toStrictEqual( links );
		expect( request.preferredLanguages ).toStrictEqual( preferredLanguages );
		expect( request.userName ).toBe( user );
	} );

	it( 'userName defaults to null', () => {
		const request = new TermboxRequest(
			'de',
			'Q5',
			4711,
			{
				editLinkUrl: '/link/to/edit/Q23',
				loginLinkUrl: '/login',
				signUpLinkUrl: '/signUp',
			},
			[ 'de', 'es', 'fr' ],
		);
		expect( request.userName ).toBeNull();
	} );
} );
