import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';

function mockMwEnv( language: string, entityId: any, namespaces: any = null, title: any = null ) {
	( window as MwWindow ).mw = {
		config: { get( key ) {
			switch ( key ) {
				case 'wgUserLanguage':
					return language;
				case 'wbEntityId':
					return entityId;
				case 'wgNamespaceIds':
					return namespaces || { special: -1 };
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
	};
}

describe( 'client/init', () => {

	it( 'returns a Promise with a TermboxRequest', () => {
		mockMwEnv( 'de', 'Q123' );
		const termboxRequestPromise = init();

		expect( termboxRequestPromise ).toBeInstanceOf( Promise );
		expect( termboxRequestPromise ).resolves.toBeInstanceOf( TermboxRequest );
	} );

	it( 'generates a TermboxRequest from the mw environment', () => {
		const namespaces = { special: 42 };
		const getUrl = jest.fn();
		const expectedEditLinkUrl = '/some/url';
		getUrl.mockReturnValue( expectedEditLinkUrl );
		const titleClass = jest.fn().mockImplementation( () => {
			return {
				getUrl,
			};
		} );

		mockMwEnv( 'en', 'Q666', namespaces, titleClass );

		return init().then( ( request ) => {
			expect( titleClass ).toHaveBeenCalledWith( 'SetLabelDescriptionAliases/Q666', namespaces.special );

			expect( request.language ).toBe( 'en' );
			expect( request.entityId ).toBe( 'Q666' );
			expect( request.editLinkUrl ).toBe( expectedEditLinkUrl );
		} );
	} );

} );
