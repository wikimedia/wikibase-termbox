import Vue from 'vue';
import ImmediatelyInvokingEntityLoadedHookHandler from '@/mock-data/ImmediatelyInvokingEntityLoadedHookHandler';
import init from '@/client/init';

function configureMwHookWithEntity( entity: any ) {
	window.mw = {
		hook: () => new ImmediatelyInvokingEntityLoadedHookHandler( entity ),
	};
}

describe( 'client/init', () => {

	it( 'returns a Promise with an App component', () => {
		configureMwHookWithEntity( {
			id: 'Q1',
			labels: {},
			descriptions: {},
			aliases: {},
		} );
		const appPromise = init();

		expect( appPromise ).toBeInstanceOf( Promise );
		expect( appPromise ).resolves.toBeInstanceOf( Vue );
	} );

	it( 'initializes the store with entity data', () => {
		const entity = {
			id: 'Q1',
			labels: { en: { language: 'en', value: 'potato' } },
			descriptions: { en: { language: 'en', value: '...' } },
			aliases: { en: [ { language: 'en', value: '...' } ] },
		};
		configureMwHookWithEntity( entity );
		init().then( ( app ) => {
			expect( app.$store.state.entity.id ).toBe( entity.id );
			expect( app.$store.state.entity.labels ).toBe( entity.labels );
			expect( app.$store.state.entity.descriptions ).toBe( entity.descriptions );
			expect( app.$store.state.entity.aliases ).toBe( entity.aliases );
		} );
	} );

} );
