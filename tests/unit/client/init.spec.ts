import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow, { MwMessage } from '@/client/mediawiki/MwWindow';

const CURRENT_PAGE = '/entity/Q123';
const USER_NAME = 'Lord Voldemort';

function mockMwEnv(
	language: string,
	entityId: any,
	namespaces: any = null,
	title: any = null,
	getUserLanguages: any = null,
	getUrl: any = null,
) {
	( window as unknown as MwWindow ).mw = {
		config: { get( key: string ) {
			switch ( key ) {
				case 'wgUserLanguage':
					return language;
				case 'wbEntityId':
					return entityId;
				case 'wgNamespaceIds':
					return namespaces || { special: -1 };
				case 'wgPageName':
					return CURRENT_PAGE;
				case 'wgUserName':
					return USER_NAME;
				default:
					return null;
			}
		} },
		hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( {} ),
		Title: title || jest.fn().mockImplementation( () => {
			return {
				getUrl: jest.fn(),
			};
		} ),
		message: (): MwMessage => {
			return {
				text: () => '',
			};
		},
		util: { getUrl: getUrl || jest.fn() },
		cookie: new ( jest.fn() )(),
		user: new ( jest.fn() )(),
	};

	( window as unknown as MwWindow ).wb = {
		WikibaseContentLanguages: {} as any,
		getUserLanguages: getUserLanguages || jest.fn(),
	};
}

describe( 'client/init', () => {

	it( 'returns a Promise with a TermboxRequest', () => {
		mockMwEnv( 'de', 'Q123' );
		const termboxRequestPromise = init();

		expect( termboxRequestPromise ).toBeInstanceOf( Promise );
		return termboxRequestPromise.then( ( request ) => {
			expect( request ).toBeInstanceOf( TermboxRequest );
		} );
	} );

	it( 'generates a TermboxRequest from the mw environment', () => {
		const namespaces = { special: 42 };
		const expectedEditLinkUrl = '/some/url';
		const expectedLoginLinkUrl = '/login';
		const expectedSignUpLinkUrl = '/signUp';

		const expectedPreferredLanguages = [ 'de', 'en', 'fr' ];
		const wbGetUserLanguages = jest.fn();
		wbGetUserLanguages.mockReturnValue( expectedPreferredLanguages );

		const titleClass = jest.fn().mockImplementation( () => {
			return {
				getUrl: () => expectedEditLinkUrl,
			};
		} );
		const mwUtilGetUrl = jest.fn()
			.mockReturnValueOnce( expectedLoginLinkUrl )
			.mockReturnValueOnce( expectedSignUpLinkUrl );

		mockMwEnv( 'en', 'Q666', namespaces, titleClass, wbGetUserLanguages, mwUtilGetUrl );

		return init().then( ( request ) => {
			expect( titleClass ).toHaveBeenCalledWith( 'SetLabelDescriptionAliases/Q666', namespaces.special );
			expect( mwUtilGetUrl ).toHaveBeenCalledWith( 'Special:UserLogin', { returnto: CURRENT_PAGE } );
			expect( mwUtilGetUrl ).toHaveBeenCalledWith(
				'Special:UserLogin',
				{ returnto: CURRENT_PAGE, type: 'signup' },
			);
			expect( wbGetUserLanguages ).toHaveBeenCalled();

			expect( request.language ).toBe( 'en' );
			expect( request.entityId ).toBe( 'Q666' );
			expect( request.links.editLinkUrl ).toBe( expectedEditLinkUrl );
			expect( request.links.loginLinkUrl ).toBe( expectedLoginLinkUrl );
			expect( request.links.signUpLinkUrl ).toBe( expectedSignUpLinkUrl );
			expect( request.preferredLanguages ).toBe( expectedPreferredLanguages );
			expect( request.userName ).toBe( USER_NAME );
		} );
	} );
} );
