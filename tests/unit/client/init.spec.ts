import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import init from '@/client/init';
import TermboxRequest from '@/common/TermboxRequest';
import MwWindow from '@/client/mediawiki/MwWindow';

function mockMwEnv( language: string, entityId: any ) {
	( window as MwWindow ).mw = {
		config: { get( key ) {
			switch ( key ) {
				case 'wgUserLanguage':
					return language;
				case 'wbEntityId':
					return entityId;
				default:
					return null;
			}
		} },
		hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( {} ),
	};
}

describe( 'client/init', () => {

	it( 'returns a Promise with a TermboxRequest', () => {
		mockMwEnv( 'de', { id: 'Q1', labels: {}, descriptions: {}, aliases: {} } );
		const termboxRequestPromise = init();

		expect( termboxRequestPromise ).toBeInstanceOf( Promise );
		expect( termboxRequestPromise ).resolves.toBeInstanceOf( TermboxRequest );
	} );

	it( 'generates a TermboxRequest from the mw environment', async () => {
		mockMwEnv( 'en', 'Q666' );

		return init().then( ( request ) => {
			expect( request.language ).toBe( 'en' );
			expect( request.entityId ).toBe( 'Q666' );
		} );
	} );

} );
