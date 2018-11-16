import TermboxRequest from '@/common/TermboxRequest';
import buildApp from '@/common/buildApp';
import FingerprintableEntity from '@/datamodel/FingerprintableEntity';

describe( 'buildApp', () => {

	it( 'fills the store from the TermboxRequest', () => {
		const entity = new FingerprintableEntity(
			'Q23',
			{ en: { language: 'en', value: 'derp' } },
			{ en: { language: 'en', value: 'derp derp' } },
			{ en: [{ language: 'en', value: 'derp derp' }] },
		);
		const req = new TermboxRequest( 'en', entity );
		const app = buildApp( req );

		expect( app.$store.state.entity.id ).toBe( entity.id );
		expect( app.$store.state.entity.labels ).toBe( entity.labels );
		expect( app.$store.state.entity.descriptions ).toBe( entity.descriptions );
		expect( app.$store.state.entity.aliases ).toBe( entity.aliases );

		expect( app.$store.state.user.primaryLanguage ).toBe( 'en' );
	} );

} );
