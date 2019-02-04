import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow, { MwMessage } from '@/client/mediawiki/MwWindow';

function mockMwEnv(
	language: string,
	entityId: any,
	namespaces: any = null,
	title: any = null,
	preferredLanguages: any = null,
) {
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
		message: ( key: string, ...params: string[] ): MwMessage =>  {
			return {
				text: () => '',
			};
		},
		uls: {
			getFrequentLanguageList: preferredLanguages || jest.fn(),
		},
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
		const getUrl = jest.fn();
		const expectedEditLinkUrl = '/some/url';

		const expectedPreferredLanguages = [ 'de', 'en', 'fr' ];
		const ulsGetFrequentLanguagesMock = jest.fn();
		ulsGetFrequentLanguagesMock.mockReturnValue( expectedPreferredLanguages );

		getUrl.mockReturnValue( expectedEditLinkUrl );
		const titleClass = jest.fn().mockImplementation( () => {
			return {
				getUrl,
			};
		} );

		mockMwEnv( 'en', 'Q666', namespaces, titleClass, ulsGetFrequentLanguagesMock );

		return init().then( ( request ) => {
			expect( titleClass ).toHaveBeenCalledWith( 'SetLabelDescriptionAliases/Q666', namespaces.special );
			expect( ulsGetFrequentLanguagesMock ).toHaveBeenCalled();

			expect( request.language ).toBe( 'en' );
			expect( request.entityId ).toBe( 'Q666' );
			expect( request.editLinkUrl ).toBe( expectedEditLinkUrl );
			expect( request.preferredLanguages ).toBe( expectedPreferredLanguages );
		} );
	} );
} );
